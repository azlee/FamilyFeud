/**
 * Calculate Levenshtein distance between two strings
 * (minimum number of edits needed to transform one string into another)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Normalize a string for comparison: lowercase, trim, remove extra spaces
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Check if two strings are a fuzzy match
 * Returns true if:
 * 1. Exact match (case insensitive)
 * 2. One is a substring of the other
 * 3. Edit distance is small enough (max 2 edits for strings > 4 chars)
 */
export function fuzzyMatch(guess: string, answer: string): boolean {
  const normalizedGuess = normalize(guess);
  const normalizedAnswer = normalize(answer);

  // Empty strings don't match
  if (!normalizedGuess || !normalizedAnswer) {
    return false;
  }

  // 1. Exact match
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }

  // 2. Substring match (either direction)
  if (normalizedAnswer.includes(normalizedGuess) || normalizedGuess.includes(normalizedAnswer)) {
    return true;
  }

  // 3. Fuzzy match with edit distance
  const distance = levenshteinDistance(normalizedGuess, normalizedAnswer);
  const maxLength = Math.max(normalizedGuess.length, normalizedAnswer.length);

  // Allow up to 2 typos for longer strings, 1 typo for short strings
  const threshold = maxLength > 4 ? 2 : 1;

  return distance <= threshold;
}

/**
 * Find the first answer that fuzzy matches the guess
 */
export function findFuzzyMatch<T extends { text: string }>(
  guess: string,
  answers: T[]
): T | undefined {
  return answers.find(answer => fuzzyMatch(guess, answer.text));
}
