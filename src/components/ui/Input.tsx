import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => (
  <div className='space-y-1'>
    {label && (
      <label
        htmlFor={props.id}
        className='font-sans text-base font-normal leading-none tracking-normal text-[#1E1E1E]'
      >
        {label}
      </label>
    )}
    <input
      className={`
        w-full h-[40px] px-4 py-3 bg-white rounded-md border border-[#D9D9D9]
        font-sans text-base font-normal leading-none tracking-normal text-[#1E1E1E]
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
      `.trim()}
      {...props}
    />
    {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
  </div>
);
