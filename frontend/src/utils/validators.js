export const validateName = (v) => {
  if (!v || v.trim().length < 4) return 'Name must be at least 4 characters';
  if (v.trim().length > 60)      return 'Name must be at most 60 characters';
  return '';
};

export const validateEmail = (v) => {
  if (!v) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email';
  return '';
};

export const validatePassword = (v) => {
  if (!v || v.length < 8)          return 'Password must be at least 8 characters';
  if (v.length > 16)               return 'Password must be at most 16 characters';
  if (!/[A-Z]/.test(v))            return 'Password must contain at least one uppercase letter';
  if (!/[!@#$%^&*]/.test(v))       return 'Password must contain at least one special character (!@#$%^&*)';
  return '';
};

export const validateAddress = (v) => {
  if (v && v.length > 400) return 'Address must be at most 400 characters';
  return '';
};

export const validateRegisterForm = ({ name, email, password, address }) => ({
  name:     validateName(name),
  email:    validateEmail(email),
  password: validatePassword(password),
  address:  validateAddress(address),
});

export const hasErrors = (errs) => Object.values(errs).some(Boolean);
