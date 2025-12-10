import { describe, it, expect } from 'vitest';
import { validateGuess } from './validation';

describe('validateGuess', () => {
  describe('Valid guesses', () => {
    it('should accept valid 4-digit guess', () => {
      const result = validateGuess('1234');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept guess with zeros in non-first positions', () => {
      const result = validateGuess('1023');
      expect(result.valid).toBe(true);
    });

    it('should accept guess with 9 as first digit', () => {
      const result = validateGuess('9876');
      expect(result.valid).toBe(true);
    });
  });

  describe('Invalid length', () => {
    it('should reject guess with less than 4 digits', () => {
      const result = validateGuess('123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('4 cifras');
    });

    it('should reject guess with more than 4 digits', () => {
      const result = validateGuess('12345');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('4 cifras');
    });

    it('should reject empty string', () => {
      const result = validateGuess('');
      expect(result.valid).toBe(false);
    });
  });

  describe('Invalid first digit', () => {
    it('should reject guess starting with 0', () => {
      const result = validateGuess('0123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('0');
    });
  });

  describe('Repeated digits', () => {
    it('should reject guess with repeated digits', () => {
      const result = validateGuess('1123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('distintas');
    });

    it('should reject guess with all same digits', () => {
      const result = validateGuess('1111');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('distintas');
    });

    it('should reject guess with two pairs of repeated digits', () => {
      const result = validateGuess('1122');
      expect(result.valid).toBe(false);
    });
  });

  describe('Non-numeric characters', () => {
    it('should reject guess with letters', () => {
      const result = validateGuess('12a4');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('dígitos');
    });

    it('should reject guess with special characters', () => {
      const result = validateGuess('12-4');
      expect(result.valid).toBe(false);
    });

    it('should reject guess with spaces', () => {
      const result = validateGuess('12 4');
      expect(result.valid).toBe(false);
    });
  });
});
