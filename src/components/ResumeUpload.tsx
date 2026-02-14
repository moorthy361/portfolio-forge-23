import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ParsedResumeData {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  profession: string;
  location: string;
  linkedin_url: string;
  skills: string[];
  education: { degree: string; institution: string; year: string; gpa: string }[];
  experience: { title: string; description: string }[];
  projects: { title: string; description: string; tech_stack: string[]; project_url: string }[];
}

interface ResumeUploadProps {
  userId: string;
  onParsed: (data: ParsedResumeData) => void;
  onSkip: () => void;
}

export const ResumeUpload = ({ userId, onParsed, onSkip }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { toast } = useToast();

  const acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFile = useCallback((f: File) => {
    if (!acceptedTypes.includes(f.type)) {
      setErrorMsg("Only PDF and DOCX files are supported.");
      setStatus("error");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("File must be under 10MB.");
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const uploadAndParse = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("uploading");
    setProgress(20);

    try {
      // Upload to storage
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("resumes")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;
      setProgress(50);
      setStatus("parsing");

      // Call edge function to parse
      const { data, error: parseErr } = await supabase.functions.invoke("parse-resume", {
        body: { filePath: path, fileName: file.name },
      });

      if (parseErr) throw parseErr;
      setProgress(100);
      setStatus("success");

      toast({ title: "Resume Parsed!", description: "Your details have been extracted. Review and edit below." });
      
      // Small delay for UX
      setTimeout(() => {
        onParsed(data as ParsedResumeData);
      }, 800);
    } catch (err: any) {
      console.error("Resume upload/parse error:", err);
      setErrorMsg(err.message || "Failed to parse resume");
      setStatus("error");
      toast({ title: "Error", description: "Failed to process resume. Try manual entry.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Upload Resume to Auto-Generate Portfolio</h2>
        <p className="text-muted-foreground">Upload your resume and we'll extract your details automatically</p>
      </div>

      {/* Drag & Drop Area */}
      <Card
        className={`p-12 border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/25 hover:border-primary/50"
        } ${status === "success" ? "border-green-500 bg-green-50" : ""} ${status === "error" ? "border-destructive bg-destructive/5" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!file) document.getElementById("resume-input")?.click();
        }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          {status === "success" ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : status === "error" ? (
            <AlertCircle className="h-16 w-16 text-destructive" />
          ) : (
            <Upload className="h-16 w-16 text-muted-foreground" />
          )}

          {file ? (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{file.name}</span>
              {!uploading && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <div>
                <p className="text-lg font-medium">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse • PDF, DOCX (max 10MB)</p>
              </div>
            </>
          )}

          {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
      </Card>

      <input
        id="resume-input"
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Progress */}
      {(status === "uploading" || status === "parsing" || status === "success") && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">
            {status === "uploading" && "Uploading resume..."}
            {status === "parsing" && "Parsing with AI... extracting your details"}
            {status === "success" && "✅ Successfully parsed!"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        {file && status !== "success" && (
          <Button onClick={uploadAndParse} disabled={uploading} size="lg">
            {uploading ? "Processing..." : "Upload & Parse Resume"}
          </Button>
        )}
        <Button variant="outline" onClick={onSkip} size="lg">
          Skip — Enter Manually
        </Button>
      </div>
    </div>
  );
};
