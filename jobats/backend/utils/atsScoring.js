const calculateATSScore = (resumeText) => {
  let score = 0;
  const breakdown = {
    formatting: 0,
    keywords: 0,
    experience: 0,
    education: 0,
    skills: 0,
  };

  const lowerText = resumeText.toLowerCase();

  // 1. Formatting Score (20 points)
  // Check for common section headers
  const sectionPatterns = [
    /experience|work history|employment/i,
    /education|academic|qualifications/i,
    /skills|technologies|competencies/i,
    /projects|portfolio/i
  ];

  let sectionsFound = 0;
  sectionPatterns.forEach(p => {
    if (p.test(resumeText)) sectionsFound++;
  });

  const hasEmail = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/.test(resumeText);
  const hasPhone = /\b(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText);

  if (hasEmail) breakdown.formatting += 5;
  if (hasPhone) breakdown.formatting += 5;
  if (sectionsFound >= 3) breakdown.formatting += 10;
  else if (sectionsFound > 0) breakdown.formatting += 5;

  // 2. Keywords Score (30 points - increased weight)
  const commonKeywords = [
    // Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript',
    // Frontend
    'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'redux', 'webpack', 'tailwind', 'bootstrap',
    // Backend
    'node', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net', 'graphql', 'rest api',
    // Database
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'dynamodb',
    // DevOps/Cloud
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'git', 'github', 'gitlab', 'terraform',
    // Data/AI
    'machine learning', 'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp',
    // Tools/Concepts
    'agile', 'scrum', 'jira', 'microservices', 'oop', 'mvc', 'system design', 'testing', 'jest', 'cypress'
  ];

  let keywordMatches = 0;
  commonKeywords.forEach(keyword => {
    // strict word boundary check for short terms like 'go', 'c', 'r'
    const pattern = (keyword.length <= 3) ? new RegExp(`\\b${keyword}\\b`, 'i') : new RegExp(keyword, 'i');
    if (pattern.test(lowerText)) {
      keywordMatches++;
    }
  });

  // Cap keywords score (target: 10+ keywords for max score)
  breakdown.keywords = Math.min(30, keywordMatches * 3);

  // 3. Experience Score (25 points)
  // Look for patterns like "5 years", "5+ yrs", "2019 - Present"
  const yearPatterns = [
    /\b(\d+)\+?\s*(years?|yrs?)/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}/i
  ];

  let hasExperience = false;
  let detectedYears = 0;

  const yearsMatch = lowerText.match(/\b(\d+)\+?\s*(years?|yrs?)/i);
  if (yearsMatch && yearsMatch[1]) {
    detectedYears = parseInt(yearsMatch[1]);
    hasExperience = true;
  } else if (/\d{4}\s*-\s*(present|current|\d{4})/i.test(lowerText)) {
    // Rough heuristic: if dates found, assume at least some experience
    hasExperience = true;
    detectedYears = 1; // Minimum baseline
  }

  if (hasExperience) {
    // Scale: 5+ years = max score
    breakdown.experience = Math.min(25, 10 + (detectedYears * 3));
  }

  // 4. Education Score (15 points)
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'diploma', 'certificate',
    'university', 'college', 'institute', 'b.tech', 'm.tech', 'b.sc', 'm.sc', 'b.a', 'm.a', 'mba', 'bba'
  ];

  let educationMatches = 0;
  educationKeywords.forEach(kw => {
    if (lowerText.includes(kw)) educationMatches++;
  });

  if (educationMatches > 0) {
    breakdown.education = Math.min(15, 5 + (educationMatches * 5));
  }

  // 5. Skills Section Score (10 points)
  // Check if skills are listed (heuristic: many comma-separated values or bullet points near "Skills")
  if (/skills?|technologies/i.test(lowerText)) {
    // Just presence of section gives points, density handles keywords score
    breakdown.skills = 10;
  }

  // Calculate Total
  score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    totalScore: Math.min(100, Math.round(score)),
    breakdown,
  };
};

module.exports = { calculateATSScore };