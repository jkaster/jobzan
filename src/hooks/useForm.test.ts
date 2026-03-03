import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from './useForm';

describe('useForm', () => {
  it('returns initial form values', () => {
    const { result } = renderHook(() =>
      useForm({ name: 'Alice', age: 30, active: true }),
    );
    expect(result.current.formData).toEqual({
      name: 'Alice',
      age: 30,
      active: true,
    });
  });

  it('updates a text field on change', () => {
    const { result } = renderHook(() => useForm({ name: '' }));
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Bob' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.name).toBe('Bob');
  });

  it('updates a number field on change', () => {
    const { result } = renderHook(() => useForm({ salary: 0 }));
    act(() => {
      const target = document.createElement('input');
      target.type = 'number';
      target.name = 'salary';
      target.value = '75000';
      result.current.handleChange({
        target,
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.salary).toBe(75000);
  });

  it('updates a checkbox field on change', () => {
    const { result } = renderHook(() => useForm({ active: false }));
    act(() => {
      const target = document.createElement('input');
      target.type = 'checkbox';
      target.name = 'active';
      target.checked = true;
      result.current.handleChange({
        target,
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.active).toBe(true);
  });

  it('allows direct state updates via setFormData', () => {
    const { result } = renderHook(() => useForm({ name: 'Alice', age: 30 }));
    act(() => {
      result.current.setFormData({ name: 'Charlie', age: 25 });
    });
    expect(result.current.formData).toEqual({ name: 'Charlie', age: 25 });
  });
});
