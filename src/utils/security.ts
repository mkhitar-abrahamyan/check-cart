/**
 * Security validation utilities to protect against common web attacks
 */

export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/script/gi, '')
    .trim();
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>'"&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[match] || match;
    })
    .trim();
};

export const sanitizeForSql = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/union/gi, '')
    .replace(/select/gi, '')
    .replace(/insert/gi, '')
    .replace(/update/gi, '')
    .replace(/delete/gi, '')
    .replace(/drop/gi, '')
    .replace(/create/gi, '')
    .replace(/alter/gi, '')
    .trim();
};

export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateName = (name: string): boolean => {
  if (typeof name !== 'string') return false;
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.length >= 1 && name.length <= 50;
};

export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCsrfToken = (token: string, storedToken: string): boolean => {
  if (typeof token !== 'string' || typeof storedToken !== 'string') return false;
  return token === storedToken && token.length === 64;
};

export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier)!;
    
    const validRequests = userRequests.filter(time => time > windowStart);
    requests.set(identifier, validRequests);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  };
};

export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  if (typeof fileName !== 'string') return false;
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

export const validateFileSize = (fileSize: number, maxSizeBytes: number): boolean => {
  return typeof fileSize === 'number' && fileSize > 0 && fileSize <= maxSizeBytes;
};

export const generateCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
};

export const validateLength = (input: string, min: number, max: number): boolean => {
  if (typeof input !== 'string') return false;
  return input.length >= min && input.length <= max;
};

export const containsSpecialChars = (input: string, allowedChars: string = ''): boolean => {
  if (typeof input !== 'string') return false;
  
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const allowedRegex = new RegExp(`[${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
  
  return specialChars.test(input.replace(allowedRegex, ''));
};

export const validateUrl = (url: string): boolean => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const sanitizeUserInput = (input: string, type: 'text' | 'email' | 'name' | 'phone' | 'zip'): string => {
  if (typeof input !== 'string') return '';
  
  let sanitized = sanitizeInput(input);
  
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase();
      break;
    case 'name':
      sanitized = sanitized.replace(/[^a-zA-Z\s\-']/g, '');
      break;
    case 'phone':
      sanitized = sanitized.replace(/[^\d\+\-\(\)\s]/g, '');
      break;
    case 'zip':
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-]/g, '');
      break;
    default:
      sanitized = sanitized.replace(/[<>'"&]/g, '');
  }
  
  return sanitized.trim();
};
