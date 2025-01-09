import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Mock elections data
  const elections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2024-11-05",
      totalVotes: 1234,
    },
    {
      id: 2,
      title: "Board Member Elections",
      status: "Scheduled",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      totalVotes: 0,
    },
  ];

  const handleDelete = (id: number) => {
    // TODO: Implement actual delete logic
    toast({
      title: "Election deleted",
      description: "The election has been successfully deleted",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button>
            <Plus className="mr-2" />
            Create Election
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">End Date</th>
                    <th className="text-left py-3 px-4">Total Votes</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr key={election.id} className="border-b">
                      <td className="py-3 px-4">{election.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            election.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {election.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{election.startDate}</td>
                      <td className="py-3 px-4">{election.endDate}</td>
                      <td className="py-3 px-4">{election.totalVotes}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(election.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;