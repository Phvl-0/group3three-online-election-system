import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useElections, useDeleteCandidate } from "@/utils/electionUtils";
import { CandidateForm } from "@/components/candidates/CandidateForm";
import { CandidateGrid } from "@/components/candidates/CandidateGrid";

const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  const { data: elections = [] } = useElections();
  const election = elections.find((e) => e.id === id);
  const deleteCandidateMutation = useDeleteCandidate();

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!id) return;
    try {
      await deleteCandidateMutation.mutateAsync({ electionId: id, candidateId });
      toast({
        title: "Candidate deleted",
        description: "The candidate has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the candidate",
        variant: "destructive",
      });
    }
  };

  if (!election) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Election not found
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
            <p className="text-muted-foreground">{election.description}</p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              <Button
                onClick={() => setIsAddingCandidate(!isAddingCandidate)}
              >
                <Plus className="mr-2" />
                Add Candidate
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingCandidate && (
                <CandidateForm
                  electionId={id}
                  onClose={() => setIsAddingCandidate(false)}
                />
              )}

              <CandidateGrid
                candidates={election.candidates || []}
                onDelete={handleDeleteCandidate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionDetails;