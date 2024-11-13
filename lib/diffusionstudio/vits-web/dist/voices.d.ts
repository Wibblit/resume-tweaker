import { Voice } from './types';

/**
 * Retrieves all available voices from huggingface
 * @returns
 */
export declare function voices(): Promise<Voice[]>;
