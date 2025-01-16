import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  bio: string;
  image?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "ended";
  candidates: Candidate[];
  totalVotes: number;
  image?: string;
}

// API functions
const fetchElections = async (): Promise<Election[]> => {
  const { data, error } = await supabase
    .from('elections')
    .select('*, candidates(*)');
  
  if (error) throw error;
  return data || [];
};

const addElection = async (election: Omit<Election, "id" | "totalVotes">): Promise<Election> => {
  const { data, error } = await supabase
    .from('elections')
    .insert([{ ...election, totalVotes: 0 }])
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

const addCandidate = async ({ electionId, candidate }: { 
  electionId: string; 
  candidate: Omit<Candidate, "id">; 
}): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([{ ...candidate, election_id: electionId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

const deleteCandidate = async ({ electionId, candidateId }: { 
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

// React Query hooks
export const useElections = () => {
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