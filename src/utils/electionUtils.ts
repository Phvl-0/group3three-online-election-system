import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// Mock database (replace with real API calls later)
let elections: Election[] = [];

// API functions
const fetchElections = async (): Promise<Election[]> => {
  return elections;
};

const addElection = async (election: Omit<Election, "id" | "totalVotes">): Promise<Election> => {
  const newElection: Election = {
    ...election,
    id: Math.random().toString(36).substr(2, 9),
    totalVotes: 0,
  };
  elections = [...elections, newElection];
  return newElection;
};

const deleteElection = async (id: string): Promise<void> => {
  elections = elections.filter((election) => election.id !== id);
};

const addCandidate = async (electionId: string, candidate: Omit<Candidate, "id">): Promise<Candidate> => {
  const newCandidate: Candidate = {
    ...candidate,
    id: Math.random().toString(36).substr(2, 9),
  };
  
  elections = elections.map((election) => {
    if (election.id === electionId) {
      return {
        ...election,
        candidates: [...(election.candidates || []), newCandidate],
      };
    }
    return election;
  });
  
  return newCandidate;
};

const deleteCandidate = async (electionId: string, candidateId: string): Promise<void> => {
  elections = elections.map((election) => {
    if (election.id === electionId) {
      return {
        ...election,
        candidates: election.candidates.filter((c) => c.id !== candidateId),
      };
    }
    return election;
  });
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
    mutationFn: ({ electionId, candidate }: { electionId: string; candidate: Omit<Candidate, "id"> }) =>
      addCandidate(electionId, candidate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ electionId, candidateId }: { electionId: string; candidateId: string }) =>
      deleteCandidate(electionId, candidateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
    },
  });
};