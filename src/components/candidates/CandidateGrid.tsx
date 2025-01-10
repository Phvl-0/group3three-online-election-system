import { Candidate } from "@/utils/electionUtils";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: Candidate[];
  onDelete: (id: string) => void;
}

export const CandidateGrid = ({ candidates, onDelete }: CandidateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};