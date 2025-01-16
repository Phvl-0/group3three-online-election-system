import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useElections, useDeleteElection } from "@/utils/electionUtils";
import ElectionForm from "@/components/elections/ElectionForm";
import { ElectionTable } from "@/components/elections/ElectionTable";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const { data: elections = [], isLoading } = useElections();
  const deleteElectionMutation = useDeleteElection();

  const handleDelete = async (id: string) => {
    try {
      await deleteElectionMutation.mutateAsync(id);
      toast({
        title: "Election deleted",
        description: "The election has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the election",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="mr-2" />
            Create Election
          </Button>
        </div>

        {isCreating && (
          <div className="mb-8">
            <ElectionForm />
          </div>
        )}

        {!isLoading && <ElectionTable elections={elections} onDelete={handleDelete} />}
      </div>
    </Layout>
  );
};

export default AdminDashboard;