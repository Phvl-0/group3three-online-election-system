import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Candidate = Database['public']['Tables']['candidates']['Row'];
export type Election = Database['public']['Tables']['elections']['Row'] & {
  candidates: Candidate[];
};

// API functions
const fetchElections = async (): Promise<Election[]> => {
  const { data, error } = await supabase
    .from('elections')
    .select('*, candidates(*)');
  
  if (error) throw error;
  return data || [];
};

const addElection = async (election: Omit<Database['public']['Tables']['elections']['Insert'], 'id' | 'total_votes'>): Promise<Election> => {
  const { data, error } = await supabase
    .from('elections')
    .insert([{ ...election, total_votes: 0 }])
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
  candidate: Omit<Database['public']['Tables']['candidates']['Insert'], 'id' | 'election_id'>; 
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