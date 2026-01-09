const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const { calculateATSScore } = require('../utils/atsScoring');
const { getGeminiModel } = require('../config/gemini');

/**
 * Analyze resume and generate ATS score with job suggestions
 */
exports.analyzeResume = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Get resume
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found. Please upload resume first.',
      });
    }

    // Calculate ATS Score
    console.log(`📊 Calculating ATS score for: ${email}`);
    const { totalScore, breakdown } = calculateATSScore(resume.extractedText);

    // Get job suggestions from Gemini
    console.log(`🤖 Generating job suggestions using Gemini AI...`);
    let jobSuggestions = [];

    try {
      const model = getGeminiModel();
      const prompt = `You are a career counselor analyzing a resume. Based on this resume, suggest 5 suitable job roles.

Resume Content:
${resume.extractedText.substring(0, 2000)}

Analyze the candidate's:
- Skills and expertise
- Experience level
- Educational background
- Career trajectory

Return ONLY a JSON array with 5 job suggestions. Each should have:
- title: Job role name
- matchPercentage: Number between 60-95 (realistic match score)
- reason: Brief explanation (1-2 sentences) why this role matches

Format:
[{"title": "Job Title", "matchPercentage": 85, "reason": "Explanation here"}]

Return ONLY the JSON array, no other text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        // Validate and filter valid suggestions
        jobSuggestions = parsedData
          .filter(job => job.title && job.matchPercentage && job.reason)
          .slice(0, 5);

        console.log(`✅ Generated ${jobSuggestions.length} job suggestions`);
      }
    } catch (geminiError) {
      console.error('⚠️ Gemini API error:', geminiError.message);
      // Fallback job suggestions
      jobSuggestions = generateFallbackJobSuggestions(resume.extractedText);
    }

    // Ensure we have at least some suggestions
    if (jobSuggestions.length === 0) {
      jobSuggestions = generateFallbackJobSuggestions(resume.extractedText);
    }

    // Save or update analysis
    let analysis = await Analysis.findOne({ email });

    if (analysis) {
      analysis.atsScore = totalScore;
      analysis.scoreBreakdown = breakdown;
      analysis.jobSuggestions = jobSuggestions;
      analysis.analyzedAt = Date.now();
      await analysis.save();
      console.log(`✅ Updated existing analysis for: ${email}`);
    } else {
      analysis = await Analysis.create({
        email,
        atsScore: totalScore,
        scoreBreakdown: breakdown,
        jobSuggestions,
      });
      console.log(`✅ Created new analysis for: ${email}`);
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('❌ Error in analyzeResume:', error);
    next(error);
  }
};

/**
 * Generate personalized career development plan
 */
exports.generateCareerPlan = async (req, res, next) => {
  try {
    const { email, targetJob } = req.body;

    // Validate inputs
    if (!email || !targetJob) {
      return res.status(400).json({
        success: false,
        error: 'Email and target job are required',
      });
    }

    // Get resume
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found. Please upload resume first.',
      });
    }

    console.log(`🎯 Generating career plan for: ${email} → ${targetJob}`);

    let planData = {};

    try {
      const model = getGeminiModel();

      const prompt = `Analyze this resume for the target job: "${targetJob}".

Resume: ${resume.extractedText.substring(0, 2500)}

Create a 3-month career development plan as plain text in this format:

**Month 1: Foundation Building**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

**Month 2: Skill Development**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

**Month 3: Portfolio & Practice**

* **Goal:** Clear objective for this month
* **Activities:**
    * Activity 1 with specific steps
    * Activity 2 with resources
    * Activity 3 with time needed
* **Deliverables:** What to complete by end of month

At the end, list:
Required Skills: skill1, skill2, skill3
Missing Skills: skill4, skill5

Make it specific and actionable for ${targetJob}.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      let careerPlanText = text.trim();

      // Extract skills from the text
      const requiredMatch = careerPlanText.match(/Required [Ss]kills?:\s*(.+?)(?:\n|$)/);
      const missingMatch = careerPlanText.match(/Missing [Ss]kills?:\s*(.+?)(?:\n|$)/);

      const requiredSkills = requiredMatch
        ? requiredMatch[1].split(',').map(s => s.trim()).filter(Boolean)
        : ["Technical Skills", "Communication", "Problem Solving"];

      const missingSkills = missingMatch
        ? missingMatch[1].split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // Remove skill lists from plan text to keep it clean
      careerPlanText = careerPlanText
        .replace(/Required [Ss]kills?:.*$/m, '')
        .replace(/Missing [Ss]kills?:.*$/m, '')
        .trim();

      planData = {
        requiredSkills,
        missingSkills,
        careerPlan: careerPlanText
      };

      console.log(`✅ Generated career plan successfully`);

    } catch (geminiError) {
      console.error('⚠️ Gemini API error:', geminiError.message);
      planData = generateFallbackCareerPlan(targetJob);
    }

    // CRITICAL: Ensure careerPlan is always a string
    if (typeof planData.careerPlan !== 'string') {
      planData.careerPlan = String(planData.careerPlan);
    }

    // Validate arrays
    if (!Array.isArray(planData.requiredSkills)) {
      planData.requiredSkills = ["Technical Skills"];
    }
    if (!Array.isArray(planData.missingSkills)) {
      planData.missingSkills = [];
    }

    // Update analysis
    const analysis = await Analysis.findOneAndUpdate(
      { email },
      {
        targetJob: {
          title: targetJob,
          requiredSkills: planData.requiredSkills,
          missingSkills: planData.missingSkills,
        },
        careerPlan: planData.careerPlan, // Now guaranteed to be a string
      },
      { new: true, upsert: true }
    );

    console.log(`✅ Career plan saved for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Career plan generated successfully',
      data: analysis,
    });
  } catch (error) {
    console.error('❌ Error in generateCareerPlan:', error);
    next(error);
  }
};

/**
 * Get existing analysis for a user
 */
exports.getAnalysis = async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const analysis = await Analysis.findOne({ email });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found. Please analyze your resume first.',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('❌ Error in getAnalysis:', error);
    next(error);
  }
};

/**
 * Helper: Generate fallback job suggestions
 */
function generateFallbackJobSuggestions(resumeText) {
  const suggestions = [];
  const lowerText = resumeText.toLowerCase();

  // Check for common keywords and suggest relevant jobs
  const jobMappings = [
    {
      keywords: ['python', 'machine learning', 'data', 'ai', 'ml'],
      job: {
        title: "Data Scientist",
        matchPercentage: 75,
        reason: "Your background shows strong analytical and programming skills relevant to data science."
      }
    },
    {
      keywords: ['javascript', 'react', 'frontend', 'web', 'html', 'css'],
      job: {
        title: "Frontend Developer",
        matchPercentage: 80,
        reason: "Your web development skills align well with frontend development roles."
      }
    },
    {
      keywords: ['java', 'backend', 'api', 'database', 'sql'],
      job: {
        title: "Backend Developer",
        matchPercentage: 78,
        reason: "Your server-side development experience matches backend engineering requirements."
      }
    },
    {
      keywords: ['full stack', 'node', 'mongodb', 'mern', 'mean'],
      job: {
        title: "Full Stack Developer",
        matchPercentage: 82,
        reason: "Your diverse technology stack makes you suitable for full stack positions."
      }
    },
    {
      keywords: ['student', 'intern', 'learning', 'fresher', 'graduate'],
      job: {
        title: "Software Engineering Intern",
        matchPercentage: 85,
        reason: "Your academic background and eagerness to learn make you ideal for internship roles."
      }
    },
  ];

  jobMappings.forEach(mapping => {
    const hasKeyword = mapping.keywords.some(kw => lowerText.includes(kw));
    if (hasKeyword && suggestions.length < 5) {
      suggestions.push(mapping.job);
    }
  });

  // Add generic suggestions if not enough specific ones
  if (suggestions.length < 3) {
    suggestions.push(
      {
        title: "Software Developer",
        matchPercentage: 70,
        reason: "Your technical skills and problem-solving abilities suit software development roles."
      },
      {
        title: "Technical Support Engineer",
        matchPercentage: 68,
        reason: "Your technical knowledge can help in supporting and troubleshooting for customers."
      },
      {
        title: "Junior Developer",
        matchPercentage: 72,
        reason: "Entry-level development roles match your current skill level and experience."
      }
    );
  }

  return suggestions.slice(0, 5);
}

/**
 * Helper: Generate fallback career plan
 */
function generateFallbackCareerPlan(targetJob) {
  return {
    requiredSkills: [
      "Technical Proficiency",
      "Problem Solving",
      "Communication Skills",
      "Team Collaboration",
      "Time Management"
    ],
    missingSkills: [
      "Advanced Programming Concepts",
      "Industry Tools & Frameworks",
      "Project Management"
    ],
    careerPlan: `**Month 1: Foundation & Skill Assessment**

* **Goal:** Strengthen core technical fundamentals and identify skill gaps for ${targetJob}
* **Activities:**
    * Complete 2-3 online courses focused on core competencies (Coursera, Udemy, or LinkedIn Learning)
    * Build 1-2 small projects to practice fundamental concepts
    * Join relevant online communities (Reddit, Discord, LinkedIn groups)
    * Review and update your resume with new skills
* **Deliverables:** Completed courses with certificates, 2 small projects on GitHub, updated resume

**Month 2: Intermediate Skills & Portfolio Building**

* **Goal:** Develop intermediate-level expertise and build a strong portfolio
* **Activities:**
    * Work on 1-2 medium-complexity projects that showcase your skills
    * Contribute to open-source projects on GitHub
    * Network with professionals in your target role (LinkedIn, Meetups)
    * Practice technical interviews on platforms like LeetCode or HackerRank
* **Deliverables:** 2 portfolio-worthy projects, 5+ GitHub contributions, expanded professional network

**Month 3: Advanced Practice & Job Preparation**

* **Goal:** Achieve job-ready proficiency and start applying
* **Activities:**
    * Complete 1 comprehensive capstone project relevant to ${targetJob}
    * Conduct mock interviews with peers or mentors
    * Optimize LinkedIn profile and portfolio website
    * Apply to 10-15 positions weekly
    * Attend industry events or webinars
* **Deliverables:** Professional portfolio, polished resume, active job applications, interview readiness

**Additional Recommendations:**
* Set aside 2-3 hours daily for focused learning
* Track your progress weekly
* Seek feedback from mentors or peers
* Stay consistent and don't get discouraged by setbacks`
  };
}

module.exports = exports;