import { useState, useCallback } from 'react';

export interface EmailSuggestion {
  address: string;
  domain: string;
  full: string;
}

interface UseEmailSuggestionReturn {
  suggestion: EmailSuggestion | null;
  checkEmail: (email: string) => void;
  applySuggestion: () => string | null;
  clearSuggestion: () => void;
}

const POPULAR_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'bol.com.br',
  'uol.com.br',
  'terra.com.br',
  'ig.com.br',
  'globo.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'msn.com',
  'protonmail.com',
  'zoho.com',
];

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

const findClosestDomain = (domain: string): string | null => {
  const lowerDomain = domain.toLowerCase();

  if (POPULAR_DOMAINS.includes(lowerDomain)) {
    return null;
  }

  let closestDomain = '';
  let minDistance = Infinity;

  for (const popularDomain of POPULAR_DOMAINS) {
    const distance = levenshteinDistance(lowerDomain, popularDomain);

    if (distance > 0 && distance <= 2 && distance < minDistance) {
      minDistance = distance;
      closestDomain = popularDomain;
    }
  }

  return minDistance <= 2 ? closestDomain : null;
};

export const useEmailSuggestion = (): UseEmailSuggestionReturn => {
  const [suggestion, setSuggestion] = useState<EmailSuggestion | null>(null);

  const checkEmail = useCallback((email: string) => {
    if (!email || email.length < 5 || !email.includes('@')) {
      setSuggestion(null);
      return;
    }

    const parts = email.split('@');

    if (parts.length !== 2) {
      setSuggestion(null);
      return;
    }

    const [address, domain] = parts;

    if (!address || !domain) {
      setSuggestion(null);
      return;
    }

    const suggestedDomain = findClosestDomain(domain);

    if (suggestedDomain) {
      setSuggestion({
        address,
        domain: suggestedDomain,
        full: `${address}@${suggestedDomain}`,
      });
    } else {
      setSuggestion(null);
    }
  }, []);

  const applySuggestion = useCallback((): string | null => {
    if (suggestion) {
      const correctedEmail = suggestion.full;
      setSuggestion(null);
      return correctedEmail;
    }
    return null;
  }, [suggestion]);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  return {
    suggestion,
    checkEmail,
    applySuggestion,
    clearSuggestion,
  };
};
