import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAddCandidate } from "@/utils/electionUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof candidateFormSchema>>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      name: "",
      party: "",
      bio: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
                  <Textarea placeholder="Enter candidate bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </FormControl>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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