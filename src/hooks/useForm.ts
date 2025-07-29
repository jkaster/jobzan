import { useState, useCallback } from 'react';

/**
 * A generic custom hook for managing form state and input changes.
 * @template T - The type of the form data object.
 * @param initialValues - The initial values for the form fields.
 * @returns An object containing the form data, a handleChange function, and a setFormData function.
 */
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [formData, setFormData] = useState<T>(initialValues);

  /**
   * Handles changes to form input fields, updating the form data state.
   * It automatically handles text, number, and other input types.
   * @param e - The change event from the input element.
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let parsedValue: string | number | boolean = value;

      if (e.target instanceof HTMLInputElement) {
        if (e.target.type === 'checkbox') {
          parsedValue = e.target.checked;
        } else if (e.target.type === 'number') {
          parsedValue = parseFloat(value);
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: parsedValue,
      }));
    },
    [],
  );

  return { formData, handleChange, setFormData };
};
