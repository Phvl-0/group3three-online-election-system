
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useElection, 
  useDeleteCandidate, 
  useCastVote, 
  useHasVoted 
} from "@/utils/electionUtils";
import { CandidateForm } from "@/components/candidates/CandidateForm";
import { CandidateGrid } from "@/components/candidates/CandidateGrid";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const { data: election, isLoading } = useElection(id);
  const { data: hasVoted, isLoading: loadingVoteStatus } = useHasVoted(id);
  const deleteCandidateMutation = useDeleteCandidate();
  const castVoteMutation = useCastVote();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view election details",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Check if user is admin
      const { data, error } = await supabase.rpc('has_role', {
        '_role': 'admin'
      });

      if (error) {
        console.error('Error checking admin role:', error);
      } else {
        setIsAdmin(!!data);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Set up real-time subscription to election changes
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`election-${id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'elections',
          filter: `id=eq.${id}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ["election", id] });
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'candidates',
          filter: `election_id=eq.${id}`
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ["election", id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

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

  const handleVote = async () => {
    if (!id || !selectedCandidate) return;
    
    setIsVoting(true);
    try {
      await castVoteMutation.mutateAsync({
        electionId: id,
        candidateId: selectedCandidate
      });
      
      toast({
        title: "Vote cast successfully",
        description: "Thank you for participating in this election!",
      });
      
      setSelectedCandidate(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cast your vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const isActive = election && 
    new Date(election.start_date) <= new Date() && 
    new Date(election.end_date) >= new Date();

  const isEnded = election && new Date(election.end_date) < new Date();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <p>Loading election details...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <p className="text-muted-foreground mb-4">{election.description}</p>
            
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>Start:</strong> {format(new Date(election.start_date), "PPP")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    <strong>End:</strong> {format(new Date(election.end_date), "PPP")}
                  </span>
                </div>
                <div className="ml-auto px-3 py-1 rounded-full text-sm font-medium" 
                  style={{
                    backgroundColor: isActive 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : isEnded 
                      ? 'rgba(156, 163, 175, 0.1)' 
                      : 'rgba(59, 130, 246, 0.1)',
                    color: isActive 
                      ? 'rgb(22, 163, 74)' 
                      : isEnded 
                      ? 'rgb(107, 114, 128)' 
                      : 'rgb(37, 99, 235)'
                  }}>
                  {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                </div>
              </div>
            </div>
            
            {isEnded && (
              <div className="mb-6">
                <Button onClick={() => navigate("/results")}>
                  View Results
                </Button>
              </div>
            )}
          </div>

          {isActive && !loadingVoteStatus && !hasVoted && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>
                  Select a candidate and submit your vote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!election.candidates?.length ? (
                    <p>No candidates available for this election.</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {election.candidates.map(candidate => (
                          <Card 
                            key={candidate.id} 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedCandidate === candidate.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedCandidate(candidate.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                  {candidate.image ? (
                                    <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-2xl font-bold text-muted-foreground">
                                      {candidate.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-bold">{candidate.name}</h3>
                                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button 
                          onClick={handleVote} 
                          disabled={!selectedCandidate || isVoting}
                          className="w-full md:w-auto"
                        >
                          {isVoting ? "Submitting..." : "Cast Vote"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isActive && !loadingVoteStatus && hasVoted && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">You have already voted in this election</h3>
                    <p className="text-muted-foreground">Thank you for participating!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isActive && !isEnded && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">This election has not started yet</h3>
                    <p className="text-muted-foreground">
                      Voting will begin on {format(new Date(election.start_date), "PPP")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              {isAdmin && (
                <Button onClick={() => setIsAddingCandidate(!isAddingCandidate)}>
                  <Plus className="mr-2" />
                  Add Candidate
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isAdmin && isAddingCandidate && (
                <CandidateForm
                  electionId={id!}
                  onClose={() => setIsAddingCandidate(false)}
                />
              )}

              <CandidateGrid
                candidates={election.candidates || []}
                onDelete={isAdmin ? handleDeleteCandidate : undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionDetails;
