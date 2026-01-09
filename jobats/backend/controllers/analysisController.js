const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const { calculateATSScore } = require('../utils/atsScoring');
const { getGeminiModel } = require('../config/gemini');

exports.analyzeResume = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Get resume
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found. Please upload resume first.',
      });
    }

    // Calculate ATS Score
    const { totalScore, breakdown } = calculateATSScore(resume.extractedText);

    // Get job suggestions from Gemini
    const model = getGeminiModel();
    const prompt = `Based on this resume, suggest 5 suitable job roles with match percentage and reason. 
    Resume: ${resume.extractedText.substring(0, 2000)}
    
    Return response in JSON format:
    [{"title": "job title", "matchPercentage": 85, "reason": "why this matches"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jobSuggestions = [];
    
    try {
      const text = response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobSuggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      jobSuggestions = [
        { title: "Software Developer", matchPercentage: 85, reason: "Strong technical skills" },
        { title: "Data Analyst", matchPercentage: 75, reason: "Analytical background" }
      ];
    }

    // Save or update analysis
    let analysis = await Analysis.findOne({ email });
    
    if (analysis) {
      analysis.atsScore = totalScore;
      analysis.scoreBreakdown = breakdown;
      analysis.jobSuggestions = jobSuggestions;
      analysis.analyzedAt = Date.now();
      await analysis.save();
    } else {
      analysis = await Analysis.create({
        email,
        atsScore: totalScore,
        scoreBreakdown: breakdown,
        jobSuggestions,
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateCareerPlan = async (req, res, next) => {
  try {
    const { email, targetJob } = req.body;

    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    // Use Gemini to analyze skill gap and generate plan
    const model = getGeminiModel();
    const prompt = `Analyze this resume for the target job "${targetJob}". 
    
    Resume: ${resume.extractedText.substring(0, 2000)}
    
    Provide:
    1. Required skills for this job (as array)
    2. Missing skills from resume (as array)
    3. Detailed 3-month career development plan
    
    Return in JSON format:
    {
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3", "skill4"],
      "careerPlan": "detailed plan text"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let planData = {};
    
    try {
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      planData = {
        requiredSkills: ["JavaScript", "React", "Node.js"],
        missingSkills: ["Docker", "Kubernetes"],
        careerPlan: "Focus on learning containerization technologies over the next 3 months..."
      };
    }

    // Update analysis
    const analysis = await Analysis.findOneAndUpdate(
      { email },
      {
        targetJob: {
          title: targetJob,
          requiredSkills: planData.requiredSkills || [],
          missingSkills: planData.missingSkills || [],
        },
        careerPlan: planData.careerPlan || '',
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalysis = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    const analysis = await Analysis.findOne({ email });
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};