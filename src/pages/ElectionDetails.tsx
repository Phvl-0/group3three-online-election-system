import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const ElectionDetails = () => {
  const { id } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const { toast } = useToast();

  // Mock election data
  const election = {
    id,
    title: "Presidential Election 2024",
    description: "Vote for the next president of the organization",
    candidates: [
      { id: "1", name: "John Doe", votes: 523, percentage: 45 },
      { id: "2", name: "Jane Smith", votes: 489, percentage: 42 },
      { id: "3", name: "Bob Johnson", votes: 156, percentage: 13 },
    ],
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      toast({
        title: "Error",
        description: "Please select a candidate",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement actual voting logic
    toast({
      title: "Success",
      description: "Your vote has been recorded",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{election.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{election.description}</p>
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                <RadioGroup
                  value={selectedCandidate}
                  onValueChange={setSelectedCandidate}
                  className="space-y-4"
                >
                  {election.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                    >
                      <RadioGroupItem value={candidate.id} id={candidate.id} />
                      <label
                        htmlFor={candidate.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {candidate.name}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                <Button onClick={handleVote} className="mt-4">
                  Submit Vote
                </Button>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Live Results</h3>
                <div className="space-y-4">
                  {election.candidates.map((candidate) => (
                    <div key={candidate.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{candidate.name}</span>
                        <span>{candidate.votes} votes ({candidate.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ElectionDetails;