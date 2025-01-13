import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAddCandidate } from "@/utils/electionUtils";
import { useToast } from "@/hooks/use-toast";
import { CandidateFormFields } from "./CandidateFormFields";
import { ImageUpload } from "../shared/ImageUpload";

const candidateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  party: z.string().min(1, "Party is required"),
  bio: z.string().min(1, "Bio is required"),
  image: z.any().optional(),
});

interface CandidateFormProps {
  electionId: string;
  onClose: () => void;
}

export const CandidateForm = ({ electionId, onClose }: CandidateFormProps) => {
  const { toast } = useToast();
  const addCandidateMutation = useAddCandidate();

  const form = useForm<z.infer<typeof candidateFormSchema>>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      name: "",
      party: "",
      bio: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof candidateFormSchema>) => {
    try {
      await addCandidateMutation.mutateAsync({
        electionId,
        candidate: {
          name: values.name,
          party: values.party,
          bio: values.bio,
          image: values.image,
        },
      });
      toast({
        title: "Candidate added",
        description: "The candidate has been successfully added",
      });
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the candidate",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CandidateFormFields form={form} />
          <ImageUpload form={form} name="image" label="Image" />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Candidate</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};