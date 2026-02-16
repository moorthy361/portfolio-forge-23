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
    const { filePath, fileName } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download the file from storage
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("resumes")
      .download(filePath);

    if (downloadErr) throw downloadErr;

    // Convert to text for AI parsing
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // For PDF/DOCX, we send the raw text content we can extract
    // Convert to base64 for the AI to process
    const base64 = uint8ArrayToBase64(uint8Array);
    
    // Use Lovable AI to parse the resume
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a resume parser. Extract structured data from the resume content provided. 
Return ONLY valid JSON with this exact structure:
{
  "full_name": "string",
  "email": "string", 
  "phone": "string",
  "bio": "2-3 sentence professional summary",
  "profession": "job title",
  "location": "city, country",
  "linkedin_url": "string or empty",
  "skills": ["skill1", "skill2"],
  "education": [{"degree": "string", "institution": "string", "year": "string", "gpa": "string"}],
  "experience": [{"title": "string", "description": "string"}],
  "projects": [{"title": "string", "description": "string", "tech_stack": ["tech1"], "project_url": ""}]
}
If a field is not found, use empty string or empty array. Always return valid JSON.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Parse this resume file (${fileName}). Extract all relevant information.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/octet-stream;base64,${base64}`
                }
              }
            ]
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      throw new Error("Failed to parse resume with AI");
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

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Parse resume error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
