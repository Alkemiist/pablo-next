import { DEFAULT_PLATFORM_RULES } from './platform-specs';
import type { Plan, ValidationResult } from './types';

export function validatePlan(plan: Plan): ValidationResult {
  const issues: ValidationResult['issues'] = [];

  if (!plan.platforms.length) {
    issues?.push({ code: 'no_platforms', message: 'No platforms enabled' });
  }

  // Simple schema checks
  if (!plan.asset.type) {
    issues?.push({ code: 'asset_missing', message: 'Asset type missing', path: ['asset', 'type'] });
  }

  // Ensure each step has platform rules
  for (const step of plan.steps) {
    if (!DEFAULT_PLATFORM_RULES[step.platform]) {
      issues?.push({ code: 'unknown_platform', message: `Unknown platform ${step.platform}` });
    }
  }

  return { valid: (issues?.length ?? 0) === 0, issues };
}


