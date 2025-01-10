import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Candidate } from "@/utils/electionUtils";

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (id: string) => void;
}

export const CandidateCard = ({ candidate, onDelete }: CandidateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.party}</p>
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