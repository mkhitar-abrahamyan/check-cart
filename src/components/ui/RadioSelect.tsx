import React from 'react';
import { CheckIcon, CrossIcon } from '../assets';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  price?: string;
  disabled?: boolean;
}

interface RadioSelectProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const RadioSelect: React.FC<RadioSelectProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className = '',
}) => (
  <div className={`space-y-1 ${className}`}>
    {label && (
      <label className='block text-sm font-medium text-gray-700 mb-3'>
        {label}
      </label>
    )}
    <div className='flex space-x-2'>
      {options.map(option => (
        <label
          key={option.value}
          className={`h-[32px]
            flex-1 py-2 px-2 flex justify-center items-center 
            border rounded-lg cursor-pointer text-sm
            transition-all duration-200 font-sans text-base font-normal leading-none tracking-normal text-[#757575]
            ${
              option.disabled
                ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed '
                : 'border-gray-200 text-gray-900'
            }
            ${
              value === option.value && !option.disabled
                ? 'bg-[#2c2c2c] text-white border-transparent'
                : ''
            }
          `}
        >
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => !option.disabled && onChange(option.value)}
            disabled={option.disabled}
            className='sr-only'
          />

          {option.disabled ? (
            <CrossIcon />
          ) : value === option.value ? (
            <CheckIcon />
          ) : null}

          <span
            className={`font-medium ${option.disabled ? 'line-through' : ''}`}
          >
            {option.label.split(' ')[0]}
            {option.price && ` - ${option.price}`}
          </span>
        </label>
      ))}
    </div>
    {error && <p className='text-sm text-red-600 mt-2'>{error}</p>}
  </div>
);
