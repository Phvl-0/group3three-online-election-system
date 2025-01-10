import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useElections, useAddCandidate, useDeleteCandidate } from "@/utils/electionUtils";

const candidateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  party: z.string().min(1, "Party is required"),
  bio: z.string().min(1, "Bio is required"),
});

const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  const { data: elections = [] } = useElections();
  const election = elections.find((e) => e.id === id);
  const addCandidateMutation = useAddCandidate();
  const deleteCandidateMutation = useDeleteCandidate();

  const form = useForm<z.infer<typeof candidateFormSchema>>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      name: "",
      party: "",
      bio: "",
    },
  });

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!id) return;
    try {
      await deleteCandidateMutation.mutateAsync({ electionId: id, candidateId });
      toast({
        title: "Candidate deleted",
        description: "The candidate has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the candidate",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof candidateFormSchema>) => {
    if (!id) return;
    try {
      await addCandidateMutation.mutateAsync({
        electionId: id,
        candidate: values,
      });
      toast({
        title: "Candidate added",
        description: "The candidate has been successfully added",
      });
      setIsAddingCandidate(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the candidate",
        variant: "destructive",
      });
    }
  };

  if (!election) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Election not found</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
            <p className="text-muted-foreground">{election.description}</p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              <Button onClick={() => setIsAddingCandidate(!isAddingCandidate)}>
                <Plus className="mr-2" />
                Add Candidate
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingCandidate && (
                <div className="mb-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter candidate name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="party"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Party</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter party name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter candidate bio"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddingCandidate(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Candidate</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {election.candidates.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{candidate.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{candidate.party}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCandidate(candidate.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{candidate.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionDetails;