import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export interface ATSAnalysis {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
}

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent ATS match";
  if (score >= 60) return "Good — a few tweaks needed";
  if (score >= 40) return "Fair — add more role keywords";
  return "Needs work for ATS screening";
};

const ATSScoreCard = ({ analysis }: { analysis: ATSAnalysis }) => {
  const score = Math.max(0, Math.min(100, analysis.ats_score || 0));

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI ATS Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold">{score}<span className="text-base text-muted-foreground">/100</span></span>
            <span className="text-sm text-muted-foreground">{scoreLabel(score)}</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {analysis.matched_keywords?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Matched keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.matched_keywords.slice(0, 20).map((k, i) => (
                <Badge key={`m-${i}`} variant="secondary" className="text-xs">{k}</Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.missing_keywords?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Missing keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_keywords.slice(0, 20).map((k, i) => (
                <Badge key={`x-${i}`} variant="outline" className="text-xs border-destructive/40 text-destructive">{k}</Badge>
              ))}
            </div>
          </div>
        )}

        {analysis.improvement_suggestions?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Suggestions</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {analysis.improvement_suggestions.map((s, i) => (
                <li key={`s-${i}`}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATSScoreCard;
