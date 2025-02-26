
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useElections, useDeleteElection } from "@/utils/electionUtils";
import ElectionForm from "@/components/elections/ElectionForm";
import { ElectionTable } from "@/components/elections/ElectionTable";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: elections = [], isLoading: electionsLoading } = useElections();
  const deleteElectionMutation = useDeleteElection();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data, error } = await supabase.rpc('has_role', {
          '_role': 'admin'
        });

        if (error) throw error;

        if (!data) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [navigate, toast]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

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

        {!electionsLoading && <ElectionTable elections={elections} onDelete={handleDelete} />}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
