import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Select an option',
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
    <select
      className={`
        w-full px-4 py-3 
        border border-gray-300 rounded-lg 
        text-gray-900 bg-white
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        transition-colors duration-200
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className='text-sm text-red-600 mt-1'>{error}</p>}
  </div>
);
