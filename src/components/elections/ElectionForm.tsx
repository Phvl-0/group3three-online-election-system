
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useAddElection } from "@/utils/electionUtils";
import { supabase } from "@/integrations/supabase/client";

interface ElectionFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "ended";
  image?: string;
}

const ElectionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addElectionMutation = useAddElection();
  const [formData, setFormData] = useState<ElectionFormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const election = await addElectionMutation.mutateAsync(formData);

      // Log election creation
      await supabase.rpc('log_admin_action', {
        action: 'create_election',
        details: JSON.stringify({
          election_id: election.id,
          title: election.title,
          start_date: election.start_date,
          end_date: election.end_date
        })
      });

      toast({
        title: "Success",
        description: "Election created successfully",
      });

      navigate("/elections");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Election</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Election Image</Label>
            <ImageUpload onChange={handleImageUpload} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create Election</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ElectionForm;
