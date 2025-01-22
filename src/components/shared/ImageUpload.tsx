import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ onChange, label = "Upload Image" }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onChange(result);
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