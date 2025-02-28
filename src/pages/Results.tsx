
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [electionResults, setElectionResults] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        return;
      }
      
      setIsLoggedIn(true);
      fetchResults();
    };

    checkAuth();
  }, [navigate, toast]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Fetch completed elections
      const { data: elections, error: electionsError } = await supabase
        .from('elections')
        .select('*')
        .eq('status', 'ended');

      if (electionsError) throw electionsError;

      // For each election, fetch results
      const resultsPromises = elections.map(async (election) => {
        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('candidate_id')
          .eq('election_id', election.id);

        if (votesError) throw votesError;

        // Count votes per candidate
        const voteCounts: Record<string, number> = {};
        votes.forEach(vote => {
          voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
        });

        // Get candidate details
        const { data: candidates, error: candidatesError } = await supabase
          .from('candidates')
          .select('*')
          .eq('election_id', election.id);

        if (candidatesError) throw candidatesError;

        // Format data for chart
        const chartData = candidates.map(candidate => ({
          name: candidate.name,
          votes: voteCounts[candidate.id] || 0,
        }));

        return {
          id: election.id,
          title: election.title,
          end_date: election.end_date,
          data: chartData,
        };
      });

      const results = await Promise.all(resultsPromises);
      setElectionResults(results);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error",
        description: "Failed to load election results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Election Results</h1>
      
      {loading ? (
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
                  Ended on {new Date(election.end_date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={election.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
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
