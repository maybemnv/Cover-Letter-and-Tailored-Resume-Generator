const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","shall","can",
  "i","we","you","he","she","it","they","them","their","our","your","its",
  "this","that","these","those","not","no","as","if","then","than","so","up",
  "about","into","through","during","before","after","above","below","between",
  "each","all","any","both","more","most","other","some","such","only","own",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function extractKeywords(text: string): string[] {
  return [...new Set(tokenize(text))];
}

export function calculateScores(
  resumeText: string,
  jdText: string
): { skillsScore: number; experienceScore: number; keywordsScore: number; overallScore: number } {
  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = extractKeywords(jdText);

  const matched = jdTokens.filter((t) => resumeTokens.has(t));
  const keywordsScore = jdTokens.length
    ? Math.round((matched.length / jdTokens.length) * 100)
    : 0;

  const SKILL_TERMS = [
    "python","javascript","typescript","react","node","sql","aws","docker",
    "kubernetes","git","api","rest","graphql","machine learning","deep learning",
    "tensorflow","pytorch","java","c++","go","rust","vue","angular","next",
    "management","leadership","agile","scrum","ci/cd","devops","figma","design",
  ];

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();
  const jdSkills = SKILL_TERMS.filter((s) => jdLower.includes(s));
  const matchedSkills = jdSkills.filter((s) => resumeLower.includes(s));
  const skillsScore = jdSkills.length
    ? Math.round((matchedSkills.length / jdSkills.length) * 100)
    : Math.min(keywordsScore + 10, 100);

  const EXP_PATTERNS = [/\d+\+?\s*years?/gi, /senior|lead|principal|staff|director|manager/gi];
  const resumeExpMatches = EXP_PATTERNS.flatMap((p) => resumeLower.match(p) ?? []).length;
  const jdExpMatches = EXP_PATTERNS.flatMap((p) => jdLower.match(p) ?? []).length;
  const experienceScore = jdExpMatches > 0
    ? Math.min(Math.round((resumeExpMatches / jdExpMatches) * 100), 100)
    : Math.min(keywordsScore + 5, 100);

  const overallScore = Math.round((skillsScore * 0.4 + experienceScore * 0.3 + keywordsScore * 0.3));

  return { skillsScore, experienceScore, keywordsScore, overallScore };
}

export function getMissingKeywords(resumeText: string, jdText: string): string[] {
  const resumeTokens = new Set(tokenize(resumeText));
  return extractKeywords(jdText)
    .filter((t) => !resumeTokens.has(t))
    .slice(0, 15);
}
