
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface VoteResult {
  candidateId: string;
  candidateName: string;
  party: string;
  voteCount: number;
}

interface ElectionResult {
  id: string;
  title: string;
  endDate: string;
  results: VoteResult[];
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to view election results",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Set up real-time subscription to vote changes
  useEffect(() => {
    const channel = supabase
      .channel('election-results-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'votes' 
        }, 
        () => {
          // Invalidate the query to refetch data when votes change
          queryClient.invalidateQueries({ queryKey: ['electionResults'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const fetchResults = async (): Promise<ElectionResult[]> => {
    // Fetch completed elections
    const { data: elections, error: electionsError } = await supabase
      .from('elections')
      .select('*')
      .eq('status', 'ended');

    if (electionsError) throw electionsError;

    if (!elections.length) return [];

    // For each election, fetch results
    const results = await Promise.all(
      elections.map(async (election) => {
        // Get all votes for this election
        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('candidate_id')
          .eq('election_id', election.id);

        if (votesError) throw votesError;

        // Count votes per candidate
        const voteCount: Record<string, number> = {};
        votes.forEach(vote => {
          voteCount[vote.candidate_id] = (voteCount[vote.candidate_id] || 0) + 1;
        });

        // Get candidate details
        const { data: candidates, error: candidatesError } = await supabase
          .from('candidates')
          .select('*')
          .eq('election_id', election.id);

        if (candidatesError) throw candidatesError;

        // Format results
        const candidateResults: VoteResult[] = candidates.map(candidate => ({
          candidateId: candidate.id,
          candidateName: candidate.name,
          party: candidate.party,
          voteCount: voteCount[candidate.id] || 0,
        }));

        return {
          id: election.id,
          title: election.title,
          endDate: election.end_date,
          results: candidateResults,
        };
      })
    );

    return results;
  };

  const { data: electionResults = [], isLoading, error } = useQuery({
    queryKey: ['electionResults'],
    queryFn: fetchResults,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30s as a fallback for real-time updates
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load election results",
      variant: "destructive",
    });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Election Results</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading results...</p>
        </div>
      ) : electionResults.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No completed elections to display results for.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {electionResults.map((election) => (
            <Card key={election.id}>
              <CardHeader>
                <CardTitle>{election.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Ended on {new Date(election.endDate).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={election.results.map(result => ({
                    name: result.candidateName,
                    party: result.party,
                    votes: result.voteCount
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-bold">{`${payload[0].payload.name}`}</p>
                            <p className="text-sm text-gray-500">{`${payload[0].payload.party}`}</p>
                            <p className="text-sm">{`Votes: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Bar dataKey="votes" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Results;
