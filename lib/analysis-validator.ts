import { ProjectAnalysis, AnalysisSeverity, FeasibilityLevel, FeaturePriority } from '@/types/project';

const VALID_LEVELS: readonly (AnalysisSeverity | FeasibilityLevel | FeaturePriority)[] = ['low', 'medium', 'high'];

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === 'string');
}

function cleanString(val: unknown): string {
  return typeof val === 'string' ? val.trim() : '';
}

function cleanStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((v) => cleanString(v)).filter((v) => v.length > 0);
}

function isValidLevel(val: unknown): val is 'low' | 'medium' | 'high' {
  return typeof val === 'string' && VALID_LEVELS.includes(val.toLowerCase() as 'low' | 'medium' | 'high');
}

export type ValidationResult =
  | { success: true; data: ProjectAnalysis }
  | { success: false; error: string };

/**
 * Performs rigorous semantic validation of a ProjectAnalysis candidate object.
 * Returns sanitized and validated ProjectAnalysis if valid, or a descriptive error.
 */
export function validateProjectAnalysis(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { success: false, error: 'Analysis payload must be a non-null object' };
  }

  const obj = raw as Record<string, unknown>;

  // 1. problem
  if (!obj.problem || typeof obj.problem !== 'object') {
    return { success: false, error: 'Missing or invalid "problem" object in analysis' };
  }
  const problemObj = obj.problem as Record<string, unknown>;
  const problemSummary = cleanString(problemObj.summary);
  const problemUsers = cleanStringArray(problemObj.users);
  const problemContext = cleanString(problemObj.context);

  if (!problemSummary || problemSummary.length < 5) {
    return { success: false, error: 'Problem summary must be at least 5 characters' };
  }
  if (!problemContext || problemContext.length < 5) {
    return { success: false, error: 'Problem context must be at least 5 characters' };
  }

  // 2. targetUsers
  if (!obj.targetUsers || typeof obj.targetUsers !== 'object') {
    return { success: false, error: 'Missing or invalid "targetUsers" object in analysis' };
  }
  const targetUsersObj = obj.targetUsers as Record<string, unknown>;
  const primaryUsers = cleanStringArray(targetUsersObj.primary);
  const secondaryUsers = cleanStringArray(targetUsersObj.secondary);
  const needs = cleanStringArray(targetUsersObj.needs);

  if (primaryUsers.length === 0) {
    return { success: false, error: 'At least one primary target user persona is required' };
  }
  if (needs.length === 0) {
    return { success: false, error: 'At least one key user need is required' };
  }

  // 3. valueProposition
  const valueProposition = cleanString(obj.valueProposition);
  if (!valueProposition || valueProposition.length < 10) {
    return { success: false, error: 'Value proposition must be at least 10 characters' };
  }

  // 4. assumptions
  const assumptions = cleanStringArray(obj.assumptions);
  if (assumptions.length === 0) {
    return { success: false, error: 'At least one product assumption must be identified' };
  }

  // 5. risks
  if (!Array.isArray(obj.risks) || obj.risks.length === 0) {
    return { success: false, error: 'At least one risk must be identified' };
  }
  const validatedRisks: ProjectAnalysis['risks'] = [];
  for (let i = 0; i < obj.risks.length; i++) {
    const r = obj.risks[i];
    if (!r || typeof r !== 'object') {
      return { success: false, error: `Risk item at index ${i} is not a valid object` };
    }
    const rObj = r as Record<string, unknown>;
    const title = cleanString(rObj.title);
    const description = cleanString(rObj.description);
    const severityRaw = cleanString(rObj.severity).toLowerCase();
    const mitigation = cleanString(rObj.mitigation);

    if (!title) {
      return { success: false, error: `Risk at index ${i} requires a title` };
    }
    if (!description) {
      return { success: false, error: `Risk at index ${i} requires a description` };
    }
    if (!isValidLevel(severityRaw)) {
      return { success: false, error: `Risk "${title}" has invalid severity "${severityRaw}". Expected "low", "medium", or "high"` };
    }
    if (!mitigation) {
      return { success: false, error: `Risk "${title}" requires a mitigation strategy` };
    }

    validatedRisks.push({
      title,
      description,
      severity: severityRaw as AnalysisSeverity,
      mitigation,
    });
  }

  // 6. feasibility
  if (!obj.feasibility || typeof obj.feasibility !== 'object') {
    return { success: false, error: 'Missing or invalid "feasibility" object in analysis' };
  }
  const fObj = obj.feasibility as Record<string, unknown>;

  const checkFeasibilityDimension = (key: 'technical' | 'product' | 'complexity') => {
    const dim = fObj[key];
    if (!dim || typeof dim !== 'object') {
      return { success: false as const, error: `Missing feasibility dimension "${key}"` };
    }
    const dObj = dim as Record<string, unknown>;
    const levelRaw = cleanString(dObj.level).toLowerCase();
    const reasoning = cleanString(dObj.reasoning);

    if (!isValidLevel(levelRaw)) {
      return { success: false as const, error: `Feasibility "${key}" has invalid level "${levelRaw}". Expected "low", "medium", or "high"` };
    }
    if (!reasoning || reasoning.length < 5) {
      return { success: false as const, error: `Feasibility "${key}" requires reasoning with at least 5 characters` };
    }

    return {
      success: true as const,
      data: {
        level: levelRaw as FeasibilityLevel,
        reasoning,
      },
    };
  };

  const techCheck = checkFeasibilityDimension('technical');
  if (!techCheck.success) return techCheck;

  const prodCheck = checkFeasibilityDimension('product');
  if (!prodCheck.success) return prodCheck;

  const compCheck = checkFeasibilityDimension('complexity');
  if (!compCheck.success) return compCheck;

  // 7. scope
  if (!obj.scope || typeof obj.scope !== 'object') {
    return { success: false, error: 'Missing or invalid "scope" object in analysis' };
  }
  const scopeObj = obj.scope as Record<string, unknown>;
  const inScope = cleanStringArray(scopeObj.inScope);
  const outOfScope = cleanStringArray(scopeObj.outOfScope);

  if (inScope.length === 0) {
    return { success: false, error: 'At least one in-scope item must be specified' };
  }
  if (outOfScope.length === 0) {
    return { success: false, error: 'At least one out-of-scope item must be specified' };
  }

  // 8. ambiguities
  const ambiguities = cleanStringArray(obj.ambiguities);

  // 9. potentialFeatures
  if (!Array.isArray(obj.potentialFeatures) || obj.potentialFeatures.length === 0) {
    return { success: false, error: 'At least one potential feature must be defined' };
  }
  const validatedFeatures: ProjectAnalysis['potentialFeatures'] = [];
  for (let i = 0; i < obj.potentialFeatures.length; i++) {
    const feat = obj.potentialFeatures[i];
    if (!feat || typeof feat !== 'object') {
      return { success: false, error: `Feature at index ${i} is not a valid object` };
    }
    const featObj = feat as Record<string, unknown>;
    const name = cleanString(featObj.name);
    const description = cleanString(featObj.description);
    const priorityRaw = cleanString(featObj.priority).toLowerCase();
    const reason = cleanString(featObj.reason);

    if (!name) {
      return { success: false, error: `Feature at index ${i} requires a name` };
    }
    if (!description) {
      return { success: false, error: `Feature "${name}" requires a description` };
    }
    if (!isValidLevel(priorityRaw)) {
      return { success: false, error: `Feature "${name}" has invalid priority "${priorityRaw}". Expected "low", "medium", or "high"` };
    }
    if (!reason) {
      return { success: false, error: `Feature "${name}" requires a reason` };
    }

    validatedFeatures.push({
      name,
      description,
      priority: priorityRaw as FeaturePriority,
      reason,
    });
  }

  // 10. generatedAt
  let generatedAt = cleanString(obj.generatedAt);
  if (!generatedAt || isNaN(Date.parse(generatedAt))) {
    generatedAt = new Date().toISOString();
  }

  const analysis: ProjectAnalysis = {
    problem: {
      summary: problemSummary,
      users: problemUsers,
      context: problemContext,
    },
    targetUsers: {
      primary: primaryUsers,
      secondary: secondaryUsers,
      needs,
    },
    valueProposition,
    assumptions,
    risks: validatedRisks,
    feasibility: {
      technical: techCheck.data,
      product: prodCheck.data,
      complexity: compCheck.data,
    },
    scope: {
      inScope,
      outOfScope,
    },
    ambiguities,
    potentialFeatures: validatedFeatures,
    generatedAt,
  };

  return { success: true, data: analysis };
}
