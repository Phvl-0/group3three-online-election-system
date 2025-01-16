import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAddElection } from "@/utils/electionUtils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElectionFormFields } from "./ElectionFormFields";
import { ImageUpload } from "../shared/ImageUpload";

const electionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  image: z.any().optional(),
});

interface ElectionFormProps {
  onClose: () => void;
}

export const ElectionForm = ({ onClose }: ElectionFormProps) => {
  const { toast } = useToast();
  const addElectionMutation = useAddElection();

  const form = useForm<z.infer<typeof electionFormSchema>>({
    resolver: zodResolver(electionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof electionFormSchema>) => {
    try {
      await addElectionMutation.mutateAsync({
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        status: "upcoming",
        candidates: [],
        image: values.image,
      });
      toast({
        title: "Election created",
        description: "The election has been successfully created",
      });
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the election",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Election</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ElectionFormFields form={form} />
            <ImageUpload form={form} name="image" label="Election Image" />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Election</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};