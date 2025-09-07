/**
 * Form validation utilities with security considerations
 */

import {
  validateEmail,
  validateName,
  sanitizeUserInput,
} from './security';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  sanitize?: boolean;
  sanitizeType?: 'text' | 'email' | 'name' | 'phone' | 'zip';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, string>;
}

export const validateField = (
  value: string,
  rules: ValidationRule,
  fieldName: string
): { isValid: boolean; error: string; sanitizedValue: string } => {
  let sanitizedValue = value;
  let error = '';

  if (rules.sanitize && rules.sanitizeType) {
    sanitizedValue = sanitizeUserInput(value, rules.sanitizeType);
  }

  if (rules.required && (!sanitizedValue || sanitizedValue.trim() === '')) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
      sanitizedValue,
    };
  }

  if (!sanitizedValue || sanitizedValue.trim() === '') {
    return { isValid: true, error: '', sanitizedValue };
  }

  if (rules.minLength && sanitizedValue.length < rules.minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${rules.minLength} characters`,
      sanitizedValue,
    };
  }

  if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${rules.maxLength} characters`,
      sanitizedValue,
    };
  }

  if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
    return {
      isValid: false,
      error: `${fieldName} format is invalid`,
      sanitizedValue,
    };
  }

  if (rules.custom) {
    const customError = rules.custom(sanitizedValue);
    if (customError) {
      return {
        isValid: false,
        error: customError,
        sanitizedValue,
      };
    }
  }

  return { isValid: true, error: '', sanitizedValue };
};

export const validateForm = (
  data: Record<string, string>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, string> = {};

  for (const [fieldName, value] of Object.entries(data)) {
    const fieldRules = rules[fieldName];
    if (!fieldRules) {
      sanitizedData[fieldName] = value;
      continue;
    }

    const validation = validateField(value, fieldRules, fieldName);
    
    if (!validation.isValid) {
      errors[fieldName] = validation.error;
    }
    
    sanitizedData[fieldName] = validation.sanitizedValue;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export const validationRules = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    sanitize: true,
    sanitizeType: 'name' as const,
    custom: (value: string) => {
      if (!validateName(value)) {
        return 'First name can only contain letters, spaces, hyphens, and apostrophes';
      }
      return null;
    },
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    sanitize: true,
    sanitizeType: 'name' as const,
    custom: (value: string) => {
      if (!validateName(value)) {
        return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
      }
      return null;
    },
  },
  email: {
    required: true,
    maxLength: 254,
    sanitize: true,
    sanitizeType: 'email' as const,
    custom: (value: string) => {
      if (!validateEmail(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  },
} as const;

export const validateCheckoutForm = (formData: {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}): ValidationResult => {
  const flatData: Record<string, string> = {
    firstName: formData.customerInfo.firstName,
    lastName: formData.customerInfo.lastName,
    email: formData.customerInfo.email,
  };

  const rules: Record<string, ValidationRule> = {
    firstName: validationRules.firstName,
    lastName: validationRules.lastName,
    email: validationRules.email,
  };

  return validateForm(flatData, rules);
};
