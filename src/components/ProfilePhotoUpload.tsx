import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload } from "lucide-react";

interface ProfilePhotoUploadProps {
  currentPreview: string;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}

const ProfilePhotoUpload = ({ currentPreview, onFileChange, onRemove }: ProfilePhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max
    onFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-5">
        {/* Preview circle */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
            {currentPreview ? (
              <img src={currentPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          {currentPreview && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Upload area */}
        <div
          className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
          <p className="text-sm text-muted-foreground">
            {currentPreview ? "Click to change photo" : "Upload JPG or PNG (max 5MB)"}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
