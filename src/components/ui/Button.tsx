import React from 'react';
import { LoadingSpinner } from '@/components/assets';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center';

  const variantClasses = {
    primary:
      'h-10 rounded-md border border-t border-[#2C2C2C] bg-[#2C2C2C] p-4 gap-2 disabled:opacity-70 text-[#F5F5F5]',
    secondary:
      'h-10 rounded-md bg-[#ffffff] p-4 gap-2 disabled:opacity-70 text-[#303030]',
  };

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${className}
        ${baseClasses}
      `.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

