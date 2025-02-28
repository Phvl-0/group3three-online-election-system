
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, User, FileText } from "lucide-react";
import { Candidate } from "@/utils/electionUtils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  onDelete?: (id: string) => void;
  isVotingMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  canVote?: boolean;
}

export const CandidateCard = ({ 
  candidate, 
  onDelete, 
  isVotingMode = false, 
  isSelected = false,
  onSelect,
  canVote = true
}: CandidateCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-200",
      isSelected && "ring-2 ring-accent shadow-lg",
      isVotingMode && !canVote && "opacity-70"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary/10">
              {candidate.image ? (
                <AvatarImage src={candidate.image} alt={candidate.name} />
              ) : (
                <AvatarFallback className="bg-primary/5">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{candidate.name}</h3>
              <p className="text-sm font-medium text-primary">{candidate.party}</p>
              {isVotingMode && (
                <div className="mt-1">
                  <p className="text-xs text-muted-foreground italic">
                    &quot;{candidate.party ? candidate.party : "Independent candidate"}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(candidate.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{candidate.bio}</p>
      </CardContent>
      {isVotingMode && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Learn More
          </Button>
          <Button 
            variant={isSelected ? "default" : "outline"}
            size="sm"
            disabled={!canVote}
            onClick={() => onSelect && onSelect(candidate.id)}
            className={cn(
              isSelected && "bg-accent text-accent-foreground",
              !canVote && "cursor-not-allowed"
            )}
          >
            {isSelected ? "Selected" : "Vote"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
