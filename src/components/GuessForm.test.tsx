import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuessForm } from './GuessForm';

describe('GuessForm', () => {
  it('renders input and submit button', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    expect(screen.getByLabelText(/Ingresá un número/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Probar/i })).toBeInTheDocument();
  });

  it('shows label with instructions', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    expect(screen.getByText(/4 cifras distintas/i)).toBeInTheDocument();
    expect(screen.getByText(/no puede ser 0/i)).toBeInTheDocument();
  });

  it('allows typing numbers', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '1234' } });

    expect(input.value).toBe('1234');
  });

  it('limits input to 4 characters', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345' } });

    // Should only accept 4 characters
    expect(input.value.length).toBeLessThanOrEqual(4);
  });

  it('disables button when less than 4 digits', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const button = screen.getByRole('button', { name: /Probar/i });
    expect(button).toBeDisabled();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123' } });

    expect(button).toBeDisabled();
  });

  it('enables button when 4 digits are entered', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1234' } });

    const button = screen.getByRole('button', { name: /Probar/i });
    expect(button).not.toBeDisabled();
  });

  it('shows error message for invalid guess', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox');
    const form = input.closest('form')!;

    // Enter guess starting with 0
    fireEvent.change(input, { target: { value: '0123' } });
    fireEvent.submit(form);

    expect(screen.getByText(/no puede ser 0/i)).toBeInTheDocument();
  });

  it('calls onSubmit with valid guess', () => {
    const mockSubmit = vi.fn();
    render(
      <GuessForm
        onSubmit={mockSubmit}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox');
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalledWith('1234');
  });

  it('clears input after successful submit', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={false}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const form = input.closest('form')!;

    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(form);

    // Input should be cleared after submit
    expect(input.value).toBe('');
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={true}
        disabled={false}
      />
    );

    expect(screen.getByText(/Probando/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables form when disabled prop is true', () => {
    render(
      <GuessForm
        onSubmit={vi.fn()}
        isLoading={false}
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
