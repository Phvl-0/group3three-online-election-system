import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, User } from "lucide-react";
import { Candidate } from "@/utils/electionUtils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (id: string) => void;
}

export const CandidateCard = ({ candidate, onDelete }: CandidateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              {candidate.image ? (
                <AvatarImage src={candidate.image} alt={candidate.name} />
              ) : (
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(candidate.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{candidate.bio}</p>
      </CardContent>
    </Card>
  );
};