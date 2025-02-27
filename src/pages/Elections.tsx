
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, Users, ArrowUpDown, TrendingUp, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ElectionTable } from "@/components/elections/ElectionTable";
import { useElections } from "@/utils/electionUtils";
import { format } from "date-fns";

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "participants">("date");
  const { data: elections = [], isLoading } = useElections();

  const activeElections = elections.filter(election => 
    new Date(election.start_date) <= new Date() && 
    new Date(election.end_date) >= new Date()
  );

  const upcomingElections = elections.filter(election => 
    new Date(election.start_date) > new Date()
  );

  const totalVotes = elections.reduce((sum, election) => sum + (election.total_votes || 0), 0);
  const participationRate = activeElections.length > 0 ? 
    Math.round((totalVotes / activeElections.length) * 100) : 0;

  const filteredElections = elections
    .filter(election => 
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      }
      return (b.total_votes || 0) - (a.total_votes || 0);
    });

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Elections Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Browse and participate in active elections or view upcoming ones.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeElections.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeElections.length === 1 ? 'election' : 'elections'} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                across all elections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Participation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participationRate}%</div>
              <p className="text-xs text-muted-foreground">
                voter participation rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Elections</CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingElections.length}</div>
              <p className="text-xs text-muted-foreground">
                scheduled for the future
              </p>
            </CardContent>
          </Card>
        </div>

        {activeElections.length > 0 && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>
                Elections currently open for voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeElections.map(election => (
                  <Link key={election.id} to={`/elections/${election.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{election.title}</CardTitle>
                        <CardDescription>
                          Ends {format(new Date(election.end_date), "PPP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">Vote Now</Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === "date" ? "participants" : "date")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort by {sortBy === "date" ? "Participants" : "Date"}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mt-4"></div>
                  <div className="h-3 bg-muted rounded w-5/6 mt-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ElectionTable
            elections={filteredElections}
            onDelete={undefined}  // Only show delete for admin role
          />
        )}

        {!isLoading && filteredElections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No elections found matching your search.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Elections;
