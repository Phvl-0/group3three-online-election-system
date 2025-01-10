import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, Users, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "ended";
}

// Mock data - replace with actual API call later
const mockElections: Election[] = [
  {
    id: "1",
    title: "Student Council Election 2024",
    description: "Annual election for student council representatives",
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    participants: 450,
    status: "upcoming"
  },
  {
    id: "2",
    title: "City Mayor Election",
    description: "Municipal election for city mayor position",
    startDate: "2024-02-15",
    endDate: "2024-02-15",
    participants: 12500,
    status: "active"
  },
  {
    id: "3",
    title: "Community Board Election",
    description: "Selection of new community board members",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    participants: 890,
    status: "ended"
  }
];

const fetchElections = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockElections;
};

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "participants">("date");
  const { toast } = useToast();

  const { data: elections = [], isLoading } = useQuery({
    queryKey: ["elections"],
    queryFn: fetchElections,
  });

  const filteredElections = elections
    .filter(election => 
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return b.participants - a.participants;
    });

  const getStatusColor = (status: Election["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <h1 className="text-4xl font-bold">Elections</h1>
          <p className="text-muted-foreground">
            Browse and participate in active elections or view upcoming ones.
          </p>
        </motion.div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredElections.map((election) => (
              <Link to={`/elections/${election.id}`} key={election.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                        {election.status}
                      </span>
                    </div>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(election.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{election.participants.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
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