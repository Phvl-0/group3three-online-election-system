import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Vote, Users, ChartBar } from "lucide-react";
import { Link } from "react-router-dom";

const Elections = () => {
  // Mock data for elections
  const elections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      description: "Vote for the next president of the organization",
      totalVotes: 1234,
      endDate: "2024-11-05",
    },
    {
      id: 2,
      title: "Board Member Elections",
      description: "Select new board members for the upcoming term",
      totalVotes: 567,
      endDate: "2024-06-30",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Active Elections</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {elections.map((election) => (
            <Card key={election.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{election.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{election.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{election.totalVotes} votes</span>
                  </div>
                  <div>Ends: {election.endDate}</div>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link to={`/elections/${election.id}`}>
                      <Vote className="mr-2" />
                      Vote Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/elections/${election.id}`}>
                      <ChartBar className="mr-2" />
                      View Results
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Elections;