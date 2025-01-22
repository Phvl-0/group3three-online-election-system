import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface ImageUploadProps {
  onChange?: (url: string) => void;
  label?: string;
  form?: UseFormReturn<any>;
  name?: string;
}

export const ImageUpload = ({ onChange, label = "Upload Image", form, name }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        if (onChange) onChange(result);
        if (form && name) {
          form.setValue(name, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="cursor-pointer"
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-2 w-32 h-32 object-cover rounded-lg"
        />
      )}
    </div>
  );
};