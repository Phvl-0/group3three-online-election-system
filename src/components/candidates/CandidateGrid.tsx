
import { useState } from "react";
import { Candidate } from "@/utils/electionUtils";
import { CandidateCard } from "./CandidateCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Vote } from "lucide-react";

interface CandidateGridProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
  isVotingMode?: boolean;
  onVote?: (candidateId: string) => void;
  hasVoted?: boolean;
  isActive?: boolean;
}

export const CandidateGrid = ({ 
  candidates, 
  onDelete, 
  isVotingMode = false,
  onVote,
  hasVoted = false,
  isActive = true
}: CandidateGridProps) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSelect = (candidateId: string) => {
    setSelectedCandidateId(candidateId === selectedCandidateId ? null : candidateId);
  };

  const handleVoteClick = () => {
    if (selectedCandidateId) {
      setShowConfirmDialog(true);
    }
  };

  const confirmVote = () => {
    if (selectedCandidateId && onVote) {
      onVote(selectedCandidateId);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      {isVotingMode && !hasVoted && isActive && (
        <div className="bg-accent/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Voting Instructions</h3>
          <p className="text-sm text-muted-foreground">
            Select <strong>ONE</strong> candidate below. Review your choice carefully before submitting.
            Your vote cannot be changed after submission.
          </p>
        </div>
      )}
      
      {hasVoted && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-medium mb-2">Thank you for voting!</h3>
          <p className="text-sm">
            Your vote has been recorded. Results will be announced when the election closes.
          </p>
        </div>
      )}
      
      {!isActive && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Election Status</h3>
          <p className="text-sm text-muted-foreground">
            {candidates.length > 0 
              ? "This election is not currently active. You can view the candidates but voting is not available at this time."
              : "No candidates have been added to this election yet."}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onDelete={onDelete}
            isVotingMode={isVotingMode}
            isSelected={selectedCandidateId === candidate.id}
            onSelect={handleSelect}
            canVote={!hasVoted && isActive}
          />
        ))}
      </div>
      
      {isVotingMode && !hasVoted && isActive && candidates.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button 
            size="lg"
            disabled={!selectedCandidateId}
            onClick={handleVoteClick}
            className="animate-vote-pulse"
          >
            <Vote className="mr-2 h-5 w-5" />
            Submit Vote
          </Button>
        </div>
      )}
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to vote for{" "}
              <strong>
                {candidates.find(c => c.id === selectedCandidateId)?.name}
              </strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVote}>
              Yes, Submit My Vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
