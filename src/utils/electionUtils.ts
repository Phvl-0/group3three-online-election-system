
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

const fetchElections = async (): Promise<Election[]> => {
  const { data, error } = await supabase
    .from('elections')
    .select(`
      *,
      candidates (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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
