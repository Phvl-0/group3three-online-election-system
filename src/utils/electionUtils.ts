
import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Candidate {
  id: string;
  election_id: string;
  name: string;
  party: string;
  bio: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  total_votes: number;
  image?: string;
  created_at: string;
  updated_at: string;
  candidates?: Candidate[];
}

export interface Vote {
  id?: string;
  election_id: string;
  candidate_id: string;
  user_id?: string;
  created_at?: string;
}

const fetchElections = async (): Promise<Election[]> => {
  const { data, error } = await supabase
    .from('elections')
    .select(`
      *,
      candidates (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Update the status based on dates
  const now = new Date();
  return (data || []).map(election => {
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);
    
    let calculatedStatus = election.status;
    if (now < startDate) {
      calculatedStatus = 'upcoming';
    } else if (now >= startDate && now <= endDate) {
      calculatedStatus = 'active';
    } else if (now > endDate) {
      calculatedStatus = 'ended';
    }
    
    // If the status has changed, update it in the database
    if (calculatedStatus !== election.status) {
      supabase
        .from('elections')
        .update({ status: calculatedStatus })
        .eq('id', election.id)
        .then(({ error }) => {
          if (error) console.error('Error updating election status:', error);
        });
    }
    
    return {
      ...election,
      status: calculatedStatus
    };
  });
};

const fetchElection = async (id: string): Promise<Election | null> => {
  const { data, error } = await supabase
    .from('elections')
    .select(`
      *,
      candidates (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  
  return data;
};

const addElection = async (election: Omit<Election, 'id' | 'total_votes' | 'created_at' | 'updated_at'>): Promise<Election> => {
  const { data, error } = await supabase
    .from('elections')
    .insert([
      {
        ...election,
        total_votes: 0
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteElection = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('elections')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

const addCandidate = async ({ 
  electionId, 
  candidate 
}: { 
  electionId: string; 
  candidate: Omit<Candidate, 'id' | 'election_id' | 'created_at' | 'updated_at'>; 
}): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([
      {
        ...candidate,
        election_id: electionId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteCandidate = async ({ 
  electionId, 
  candidateId 
}: { 
  electionId: string; 
  candidateId: string; 
}): Promise<void> => {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', candidateId)
    .eq('election_id', electionId);

  if (error) throw error;
};

const castVote = async ({
  electionId,
  candidateId
}: {
  electionId: string;
  candidateId: string;
}): Promise<void> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('You must be logged in to vote');
  
  // Check if the user has already voted in this election
  const { data: existingVotes, error: checkError } = await supabase
    .from('votes')
    .select('*')
    .eq('election_id', electionId)
    .eq('user_id', user.id);
    
  if (checkError) throw checkError;
  
  if (existingVotes && existingVotes.length > 0) {
    throw new Error('You have already voted in this election');
  }
  
  // Cast the vote
  const { error } = await supabase
    .from('votes')
    .insert([{
      election_id: electionId,
      candidate_id: candidateId,
      user_id: user.id
    }]);
    
  if (error) throw error;
  
  // Update the total votes count
  const { error: updateError } = await supabase
    .rpc('increment_election_votes', { election_id: electionId });
    
  if (updateError) throw updateError;
};

const checkIfUserVoted = async (electionId: string): Promise<boolean> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('election_id', electionId)
    .eq('user_id', user.id);
    
  if (error) throw error;
  
  return data && data.length > 0;
};

export const useElections = () => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const channel = supabase
      .channel('election-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'elections' 
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['elections'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["elections"],
    queryFn: fetchElections,
  });
};

export const useElection = (id: string | undefined) => {
  return useQuery({
    queryKey: ["election", id],
    queryFn: () => fetchElection(id as string),
    enabled: !!id,
  });
};

export const useAddElection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addElection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};

export const useDeleteElection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteElection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};

export const useAddCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};

export const useCastVote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: castVote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
      queryClient.invalidateQueries({ queryKey: ["election", variables.electionId] });
      queryClient.invalidateQueries({ queryKey: ["hasVoted", variables.electionId] });
      queryClient.invalidateQueries({ queryKey: ["electionResults"] });
    },
  });
};

export const useHasVoted = (electionId: string | undefined) => {
  return useQuery({
    queryKey: ["hasVoted", electionId],
    queryFn: () => checkIfUserVoted(electionId as string),
    enabled: !!electionId,
  });
};
