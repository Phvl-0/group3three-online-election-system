
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleUser, Award, Users } from "lucide-react";

interface VoteResult {
  candidateId: string;
  candidateName: string;
  party: string;
  voteCount: number;
  color?: string;
}

interface ElectionResult {
  id: string;
  title: string;
  endDate: string;
  totalVotes: number;
  results: VoteResult[];
}

// Generate colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedView, setSelectedView] = useState<'bar' | 'pie'>('bar');

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
        (payload) => {
          console.log("Real-time vote update received:", payload);
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

        // Format results and add colors for pie chart
        const candidateResults: VoteResult[] = candidates.map((candidate, index) => ({
          candidateId: candidate.id,
          candidateName: candidate.name,
          party: candidate.party,
          voteCount: voteCount[candidate.id] || 0,
          color: COLORS[index % COLORS.length]
        }));

        return {
          id: election.id,
          title: election.title,
          endDate: election.end_date,
          totalVotes: election.total_votes,
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
    console.error("Error fetching results:", error);
    toast({
      title: "Error",
      description: "Failed to load election results",
      variant: "destructive",
    });
  }

  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  const getWinner = (results: VoteResult[]) => {
    if (!results.length) return null;
    return results.reduce((prev, current) => 
      (prev.voteCount > current.voteCount) ? prev : current
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Election Results</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading results...</p>
          </div>
        ) : electionResults.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No completed elections to display results for.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {electionResults.map((election) => {
              const winner = getWinner(election.results);
              
              return (
                <Card key={election.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{election.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ended on {new Date(election.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {election.totalVotes} {election.totalVotes === 1 ? 'vote' : 'votes'} cast
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    {winner && (
                      <div className="mb-6 p-4 border rounded-lg bg-yellow-50/50 border-yellow-200">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-yellow-100">
                            <Award className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Winner: {winner.candidateName}</h3>
                            <p className="text-muted-foreground">
                              {winner.party} · {winner.voteCount} votes ({calculatePercentage(winner.voteCount, election.totalVotes)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Tabs defaultValue="bar" className="w-full" onValueChange={(value) => setSelectedView(value as 'bar' | 'pie')}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Voting Results</h3>
                        <TabsList>
                          <TabsTrigger value="bar">
                            <BarChart className="h-4 w-4 mr-2" />
                            Bar Chart
                          </TabsTrigger>
                          <TabsTrigger value="pie">
                            <CircleUser className="h-4 w-4 mr-2" />
                            Pie Chart
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="bar" className="space-y-4">
                        <div className="h-[300px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={election.results.map(result => ({
                                name: result.candidateName,
                                party: result.party,
                                votes: result.voteCount,
                                percentage: calculatePercentage(result.voteCount, election.totalVotes)
                              }))}
                              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                              <YAxis />
                              <Tooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-3 border rounded shadow">
                                        <p className="font-bold">{`${payload[0].payload.name}`}</p>
                                        <p className="text-sm text-gray-500">{`${payload[0].payload.party}`}</p>
                                        <p className="text-sm">{`Votes: ${payload[0].value} (${payload[0].payload.percentage}%)`}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Legend />
                              <Bar dataKey="votes" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="pie">
                        <div className="h-[300px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={election.results}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="voteCount"
                                nameKey="candidateName"
                              >
                                {election.results.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-white p-3 border rounded shadow">
                                        <p className="font-bold">{data.candidateName}</p>
                                        <p className="text-sm text-gray-500">{data.party}</p>
                                        <p className="text-sm">
                                          {data.voteCount} votes 
                                          ({calculatePercentage(data.voteCount, election.totalVotes)}%)
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        Detailed Results
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="p-3 text-left font-medium">Candidate</th>
                              <th className="p-3 text-left font-medium">Party</th>
                              <th className="p-3 text-right font-medium">Votes</th>
                              <th className="p-3 text-right font-medium">Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {election.results.sort((a, b) => b.voteCount - a.voteCount).map(result => (
                              <tr key={result.candidateId} className="border-b hover:bg-muted/30">
                                <td className="p-3">{result.candidateName}</td>
                                <td className="p-3">{result.party}</td>
                                <td className="p-3 text-right">{result.voteCount}</td>
                                <td className="p-3 text-right">
                                  {calculatePercentage(result.voteCount, election.totalVotes)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
