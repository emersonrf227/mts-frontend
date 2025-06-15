'use client';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { UseFormReturn } from 'react-hook-form';
import { formatMoney } from '@/lib/utils';

type MoneyInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
};

export const MoneyInput = (props: MoneyInputProps) => {
  const [inputValue, setInputValue] = useState<string>(
    props.value ? formatMoney(Number(props.value)) : ''
  );

  useEffect(() => {
    const formValue = props.form.getValues(props.name);
    if (formValue && formValue !== inputValue) {
      setInputValue(formatMoney(Number(formValue)));
    }
  }, [props.form, props.name, props.value, inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = (Number(rawValue) / 100).toFixed(2);
    setInputValue(rawValue);
    props.form.setValue(props.name, numericValue, { shouldValidate: true });
  };

  const handleBlur = () => {
    if (inputValue) {
      const formattedValue = formatMoney(Number(inputValue) / 100);
      setInputValue(formattedValue);
    }
  };

  const handleFocus = () => {
    const currentValue = props.form.getValues(props.name);
    if (currentValue) {
      setInputValue((Number(currentValue) * 100).toString());
    }
  };

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              name={field.name}
              disabled={props.disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
