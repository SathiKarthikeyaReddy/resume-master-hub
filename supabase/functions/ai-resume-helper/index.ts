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
    } else if (type === "skills") {
      systemPrompt = `You are an expert resume writer and career advisor. Your task is to suggest relevant skills based on job titles and experience.
Focus on:
- Technical skills relevant to the roles
- Soft skills that complement the experience
- Industry-standard tools and technologies
- ATS-friendly skill keywords that recruiters search for
Return skills as a comma-separated list.`;

      const jobTitles = context?.jobTitles?.join(", ") || "";
      const companies = context?.companies?.join(", ") || "";
      const existingSkills = context?.existingSkills?.join(", ") || "";
      
      userPrompt = `Based on these job titles: ${jobTitles || "general professional"}
${companies ? `At companies: ${companies}` : ""}
${existingSkills ? `Already has these skills: ${existingSkills}` : ""}

Suggest 8-10 additional relevant skills that would strengthen this resume. Return ONLY a comma-separated list of skills, nothing else.`;
    } else if (type === "job-analysis") {
      systemPrompt = `You are an expert career coach and ATS optimization specialist. Analyze job descriptions and compare them against resumes to provide actionable improvement suggestions.

Focus on:
- Missing keywords that should be added
- Skills gaps between the resume and job requirements
- Experience descriptions that could be reworded to match job terminology
- ATS optimization tips
- Specific, actionable recommendations

Be specific and reference exact phrases from both the job description and resume.`;

      const resumeData = context?.resumeData;
      const jobDescription = context?.jobDescription;
      
      userPrompt = `Analyze this job posting and compare it to the candidate's resume. Provide specific improvement suggestions.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
Name: ${resumeData?.personalInfo?.fullName || "Not provided"}
Summary: ${resumeData?.summary || "Not provided"}
Experience: ${resumeData?.experience?.map((e: { jobTitle: string; company: string; bullets: string[] }) => `${e.jobTitle} at ${e.company}: ${e.bullets?.join("; ")}`).join("\n") || "Not provided"}
Skills: ${resumeData?.skills?.join(", ") || "Not provided"}

Provide your analysis in this JSON format:
{
  "matchScore": <number 0-100>,
  "missingKeywords": ["keyword1", "keyword2"],
  "skillsToAdd": ["skill1", "skill2"],
  "bulletImprovements": [{"original": "original text", "suggestion": "improved text"}],
  "summaryTips": ["tip1", "tip2"],
  "overallTips": ["tip1", "tip2"]
}`;
    } else if (type === "cover-letter") {
      systemPrompt = `You are an expert cover letter writer. Create compelling, personalized cover letters that:
- Open with a strong hook that shows genuine interest
- Connect the candidate's experience to the job requirements
- Use specific examples and achievements from their resume
- Maintain a professional but personable tone
- Include a strong call to action
- Are concise (3-4 paragraphs)
- Are ATS-friendly`;

      const resumeData = context?.resumeData;
      const jobDescription = context?.jobDescription;
      const companyName = context?.companyName || "the company";
      const jobTitle = context?.jobTitle || "the position";
      
      userPrompt = `Write a cover letter for this candidate applying to ${companyName} for the ${jobTitle} position.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
Name: ${resumeData?.personalInfo?.fullName || "Candidate"}
Email: ${resumeData?.personalInfo?.email || ""}
Phone: ${resumeData?.personalInfo?.phone || ""}
Summary: ${resumeData?.summary || "Not provided"}
Experience: ${resumeData?.experience?.map((e: { jobTitle: string; company: string; startDate: string; endDate: string; current: boolean; bullets: string[] }) => `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate}): ${e.bullets?.join("; ")}`).join("\n") || "Not provided"}
Education: ${resumeData?.education?.map((e: { degree: string; institution: string }) => `${e.degree} from ${e.institution}`).join(", ") || "Not provided"}
Skills: ${resumeData?.skills?.join(", ") || "Not provided"}

Write only the cover letter content (no headers or signature block). Make it compelling and specific to this role.`;
    } else if (type === "parse-resume") {
      systemPrompt = `You are an expert resume parser. Extract structured data from resume text.
Be thorough and extract all relevant information.
For dates, use formats like "Jan 2020" or "2020".
For bullets, extract each achievement or responsibility as a separate item.
If information is unclear or missing, use empty strings or empty arrays.`;

      const resumeText = context?.resumeText;
      
      userPrompt = `Parse this resume text and extract structured data.

RESUME TEXT:
${resumeText}

Return the data in this exact JSON format:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "summary": "",
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "graduationDate": "",
      "gpa": "",
      "description": ""
    }
  ],
  "skills": []
}`;
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
        max_tokens: type === "cover-letter" ? 1000 : type === "job-analysis" || type === "parse-resume" ? 2000 : 300,
        temperature: type === "parse-resume" ? 0.3 : 0.7,
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

    // For job-analysis and parse-resume, try to parse as JSON
    if (type === "job-analysis" || type === "parse-resume") {
      try {
        // Extract JSON from the response (it might be wrapped in markdown)
        const jsonMatch = suggestion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ suggestion: parsed }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        // Fall through to return raw suggestion
      }
    }

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
