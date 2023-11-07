import { ChangeEvent } from 'react';

export interface FormInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}

export const FormInput = ({ id, value, onChange, placeholder, type }: FormInputProps) => {
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e.target.value);
  };
  return (
    <input
      id={id}
      type={type ? type : 'text'}
      className="bg-transparent p-1 w-full"
      placeholder={placeholder}
      value={value}
      onChange={onInputChange}
    />
  );
};
