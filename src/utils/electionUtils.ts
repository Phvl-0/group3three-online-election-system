import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// Mock API functions for now
const fetchElections = async (): Promise<Election[]> => {
  return [];
};

const addElection = async (election: Omit<Election, 'id' | 'total_votes' | 'created_at' | 'updated_at'>): Promise<Election> => {
  return {
    id: String(Date.now()),
    ...election,
    total_votes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    candidates: []
  };
};

const deleteElection = async (id: string): Promise<void> => {
  // Mock delete
};

const addCandidate = async ({ electionId, candidate }: { 
  electionId: string; 
  candidate: Omit<Candidate, 'id' | 'election_id' | 'created_at' | 'updated_at'>; 
}): Promise<Candidate> => {
  return {
    id: String(Date.now()),
    election_id: electionId,
    ...candidate,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const deleteCandidate = async ({ electionId, candidateId }: { 
  electionId: string; 
  candidateId: string; 
}): Promise<void> => {
  // Mock delete
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