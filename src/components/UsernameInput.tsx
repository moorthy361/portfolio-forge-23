import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  currentUserId?: string;
  disabled?: boolean;
}

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

const UsernameInput = ({ value, onChange, currentUserId, disabled }: UsernameInputProps) => {
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const checkAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setStatus("invalid");
      return;
    }
    if (!USERNAME_REGEX.test(username)) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");
    try {
      const { data } = await (supabase as any)
        .from("profiles_public")
        .select("user_id")
        .eq("username", username)
        .maybeSingle();

      if (data && data.user_id !== currentUserId) {
        setStatus("taken");
      } else {
        setStatus("available");
      }
    } catch {
      setStatus("idle");
    }
  }, [currentUserId]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!value) { setStatus("idle"); return; }

    const timer = setTimeout(() => checkAvailability(value), 500);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [value, checkAvailability]);

  const handleChange = (raw: string) => {
    const sanitized = raw.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-").slice(0, 30);
    onChange(sanitized);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Choose your portfolio URL</Label>
      <div className="flex items-center gap-0 rounded-md border border-input overflow-hidden bg-background">
        <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input whitespace-nowrap hidden sm:block">
          {baseUrl}/p/
        </span>
        <span className="px-2 py-2 text-sm text-muted-foreground bg-muted border-r border-input sm:hidden">
          /p/
        </span>
        <Input
          id="username"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="your-name"
          disabled={disabled}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="px-3 flex items-center">
          {status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {status === "available" && <Check className="h-4 w-4 text-green-500" />}
          {status === "taken" && <X className="h-4 w-4 text-destructive" />}
          {status === "invalid" && value && <X className="h-4 w-4 text-yellow-500" />}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {status === "available" && "✓ This username is available!"}
        {status === "taken" && "✗ This username is already taken. Try another."}
        {status === "invalid" && value && "Use 3+ lowercase letters, numbers, and hyphens only."}
        {status === "idle" && "Lowercase letters, numbers, and hyphens. Min 3 characters."}
        {status === "checking" && "Checking availability..."}
      </p>
    </div>
  );
};

export { UsernameInput };
export default UsernameInput;
