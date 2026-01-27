import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, currentContent, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "summary") {
      systemPrompt = `You are an expert resume writer. Your task is to improve professional summaries for resumes. 
Write in first person, be concise (2-4 sentences), and focus on achievements and value proposition.
Use strong action words and quantify achievements when possible.
Make it ATS-friendly by using industry-standard terminology.`;
      
      userPrompt = currentContent 
        ? `Improve this professional summary to make it more impactful and compelling:\n\n"${currentContent}"\n\nProvide only the improved summary, nothing else.`
        : "Write a compelling professional summary for a job seeker. Keep it general but impactful. Provide only the summary, nothing else.";
    } else if (type === "bullet") {
      systemPrompt = `You are an expert resume writer. Your task is to improve resume bullet points.
Use the STAR method (Situation, Task, Action, Result) when applicable.
Start with strong action verbs and quantify results when possible.
Be concise but impactful. Focus on achievements, not just responsibilities.
Make it ATS-friendly.`;

      const jobContext = context?.jobTitle 
        ? `for a ${context.jobTitle} position at ${context.company || "a company"}` 
        : "";
      
      userPrompt = currentContent
        ? `Improve this resume bullet point ${jobContext}:\n\n"${currentContent}"\n\nProvide only the improved bullet point, nothing else.`
        : `Write an impactful resume bullet point ${jobContext}. Make it achievement-focused. Provide only the bullet point, nothing else.`;
    }

    console.log(`Processing ${type} request...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      throw new Error("No suggestion received from AI");
    }

    console.log(`Successfully generated ${type} suggestion`);

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("AI resume helper error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
