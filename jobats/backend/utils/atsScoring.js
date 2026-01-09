const calculateATSScore = (resumeText) => {
  let score = 0;
  const breakdown = {
    formatting: 0,
    keywords: 0,
    experience: 0,
    education: 0,
    skills: 0,
  };

  // Formatting Score (20 points)
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText);
  const hasSections = /(experience|education|skills|projects)/gi.test(resumeText);
  
  if (hasEmail) breakdown.formatting += 7;
  if (hasPhone) breakdown.formatting += 7;
  if (hasSections) breakdown.formatting += 6;

  // Keywords Score (25 points)
  const technicalKeywords = [
    'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker',
    'git', 'api', 'agile', 'scrum', 'machine learning', 'data analysis'
  ];
  
  let keywordCount = 0;
  technicalKeywords.forEach(keyword => {
    if (new RegExp(keyword, 'gi').test(resumeText)) {
      keywordCount++;
    }
  });
  breakdown.keywords = Math.min(25, keywordCount * 2);

  // Experience Score (25 points)
  const experienceMatches = resumeText.match(/\d+\+?\s*(year|yr|years|yrs)/gi);
  if (experienceMatches) {
    const years = experienceMatches.map(match => parseInt(match)).reduce((a, b) => a + b, 0);
    breakdown.experience = Math.min(25, years * 3);
  }

  // Education Score (15 points)
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'b.tech', 'm.tech'];
  educationKeywords.forEach(keyword => {
    if (new RegExp(keyword, 'gi').test(resumeText)) {
      breakdown.education += 5;
    }
  });
  breakdown.education = Math.min(15, breakdown.education);

  // Skills Score (15 points)
  const skillsSectionMatch = resumeText.match(/skills?[\s\S]{0,500}/gi);
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[0];
    const skillCount = skillsText.split(/[,\n•]/).length;
    breakdown.skills = Math.min(15, skillCount * 1.5);
  }

  // Calculate total score
  score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    totalScore: Math.min(100, Math.round(score)),
    breakdown,
  };
};

module.exports = { calculateATSScore };