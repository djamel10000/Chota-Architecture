import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, AVAILABLE_MODELS, Role } from '../types';

describe('Types and Constants', () => {
    it('has correct default configuration', () => {
        expect(DEFAULT_CONFIG.modelName).toBe('gemini-2.5-flash');
        expect(DEFAULT_CONFIG.temperature).toBe(1);
        expect(DEFAULT_CONFIG.topK).toBe(64);
        expect(DEFAULT_CONFIG.topP).toBe(0.95);
        expect(DEFAULT_CONFIG.useSearch).toBe(false);
        expect(DEFAULT_CONFIG.useThinking).toBe(false);
        expect(DEFAULT_CONFIG.thinkingBudget).toBe(1024);
    });

    it('has available models defined', () => {
        expect(AVAILABLE_MODELS).toHaveLength(3);
        expect(AVAILABLE_MODELS[0].id).toBe('gemini-2.5-flash');
        expect(AVAILABLE_MODELS[1].id).toBe('gemini-3-pro-preview');
        expect(AVAILABLE_MODELS[2].id).toBe('gemini-2.5-flash-thinking');
    });

    it('has correct role enum values', () => {
        expect(Role.USER).toBe('user');
        expect(Role.MODEL).toBe('model');
    });
});
