import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chunk = 8192;
  let result = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    result += String.fromCharCode(...slice);
  }
  return btoa(result);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Create client with user's token to verify authentication
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated using getClaims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    const { filePath, fileName, jobRole } = await req.json();

    // Verify the file path belongs to this user
    if (!filePath.startsWith(userId + '/')) {
      return new Response(
        JSON.stringify({ error: 'Access denied - file does not belong to user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role key for file download after auth is verified
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download the file from storage
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("resumes")
      .download(filePath);

    if (downloadErr) throw downloadErr;

    // Convert to base64 for AI processing
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = uint8ArrayToBase64(uint8Array);

    // Determine correct MIME type from file extension
    const ext = fileName.split(".").pop()?.toLowerCase();
    let mimeType = "application/pdf";
    if (ext === "docx") {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const targetRole = (jobRole || "").toString().trim();

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyst and portfolio content writer.
${targetRole ? `The candidate is targeting the role: "${targetRole}". Tailor every field to that role.` : ""}

Analyze the attached resume and produce an ATS-optimized, keyword-rich digital portfolio.

Rules:
- Rewrite the summary as a 2-3 sentence ATS-friendly professional summary in third person, no pronouns, packed with role-relevant keywords.
- Start every experience, project and achievement description with a strong action verb (Developed, Engineered, Led, Optimized, Delivered...). Prefer measurable impact.
- Split skills into technical_skills (tools, languages, frameworks, platforms) and soft_skills.
- Use standard ATS section wording. Never invent facts that are not supported by the resume; leave fields empty instead.
- ats_score is an integer 0-100 estimating how well this resume would pass an ATS screen for the target role.
- matched_keywords: role keywords actually present in the resume. missing_keywords: important role keywords absent from the resume.
- improvement_suggestions: 3-5 short, specific, actionable tips.

Return ONLY valid JSON with this exact structure:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "bio": "ATS-friendly professional summary",
  "profession": "job title aligned to the target role",
  "location": "city, country",
  "linkedin_url": "string or empty",
  "github_url": "string or empty",
  "skills": ["skill"],
  "technical_skills": ["skill"],
  "soft_skills": ["skill"],
  "education": [{"degree": "string", "institution": "string", "year": "string", "gpa": "string"}],
  "experience": [{"title": "string", "description": "action-verb bullet summary"}],
  "projects": [{"title": "string", "description": "action-verb bullet summary", "tech_stack": ["tech"], "project_url": ""}],
  "certifications": ["string"],
  "ats_score": 0,
  "matched_keywords": ["string"],
  "missing_keywords": ["string"],
  "improvement_suggestions": ["string"]
}
If a field is not found, use an empty string or empty array. Always return valid JSON.`;

    // Use Lovable AI (Google Gemini) to analyze and optimize the resume
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this resume file (${fileName})${targetRole ? ` for the target role "${targetRole}"` : ""} and return the ATS-optimized portfolio JSON.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              }
            ]
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errText);
      const status = aiResponse.status === 429 || aiResponse.status === 402 ? aiResponse.status : 500;
      return new Response(
        JSON.stringify({
          error: status === 429
            ? "AI rate limit reached. Please try again in a moment."
            : status === 402
            ? "AI credits exhausted. Please add credits to continue."
            : "Failed to analyze resume with AI.",
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    // Normalize so the client always gets predictable shapes
    const asArray = (v: unknown) => (Array.isArray(v) ? v : []);
    const normalized = {
      full_name: parsed.full_name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      bio: parsed.bio || "",
      profession: parsed.profession || targetRole || "",
      location: parsed.location || "",
      linkedin_url: parsed.linkedin_url || "",
      github_url: parsed.github_url || "",
      skills: asArray(parsed.skills),
      technical_skills: asArray(parsed.technical_skills),
      soft_skills: asArray(parsed.soft_skills),
      education: asArray(parsed.education),
      experience: asArray(parsed.experience),
      projects: asArray(parsed.projects),
      certifications: asArray(parsed.certifications),
      ats_score: Math.max(0, Math.min(100, Number(parsed.ats_score) || 0)),
      matched_keywords: asArray(parsed.matched_keywords),
      missing_keywords: asArray(parsed.missing_keywords),
      improvement_suggestions: asArray(parsed.improvement_suggestions),
    };

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Parse resume error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process resume. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
