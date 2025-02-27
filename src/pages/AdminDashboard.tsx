
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Plus, AlertTriangle } from "lucide-react";
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
  const [sessionActive, setSessionActive] = useState(true);
  
  const { data: elections = [], isLoading: electionsLoading } = useElections();
  const deleteElectionMutation = useDeleteElection();

  // Check session activity every minute
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.rpc('is_session_active');
        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Session Expired",
            description: "Your admin session has expired. Please log in again.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }
        setSessionActive(true);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, [navigate, toast]);

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

        // Log admin access
        await supabase.rpc('log_admin_action', {
          action: 'admin_dashboard_access',
          details: JSON.stringify({ timestamp: new Date().toISOString() })
        });

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
      
      // Log deletion action
      await supabase.rpc('log_admin_action', {
        action: 'delete_election',
        details: JSON.stringify({ election_id: id })
      });
      
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

  if (!isAdmin || !sessionActive) {
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

        {!sessionActive && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your session has been inactive for a while. You may need to refresh or login again.
                </p>
              </div>
            </div>
          </div>
        )}

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
