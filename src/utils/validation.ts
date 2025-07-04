
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: string, rule: ValidationRule): string | null => {
  if (rule.required && !value.trim()) {
    return 'This field is required';
  }

  if (value && rule.minLength && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  if (value && rule.maxLength && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  if (value && rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  if (value && rule.custom) {
    return rule.custom(value);
  }

  return null;
};

export const validateForm = (data: Record<string, string>, schema: ValidationSchema): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(schema).forEach(field => {
    const error = validateField(data[field] || '', schema[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation schemas
export const postValidationSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  content: {
    required: true,
    minLength: 10
  },
  author: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  imageUrl: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'Please enter a valid image URL';
      }
      return null;
    }
  }
};
