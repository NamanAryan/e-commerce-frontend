// src/utils/safeRef.ts
import { RefObject } from 'react';

/**
 * Safely access a ref's current property
 * Returns null if the ref is null instead of throwing an error
 */
export function safeRef<T>(ref: RefObject<T> | null | undefined): T | null {
  if (!ref) return null;
  return ref.current;
}