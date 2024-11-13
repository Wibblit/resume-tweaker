import { InferenceConfg, ProgressCallback } from './types';

/**
 * Run text to speech inference in new worker thread. Fetches the model
 * first, if it has not yet been saved to opfs yet.
 */
export declare function predict(config: InferenceConfg, callback?: ProgressCallback): Promise<Blob>;
