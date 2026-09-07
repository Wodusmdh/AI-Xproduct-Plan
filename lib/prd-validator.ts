import { ProjectPRD } from '@/types/project';

export type PRDValidationResult =
  | { success: true; data: ProjectPRD }
  | { success: false; error: string };

function cleanString(val: unknown): string {
  return typeof val === 'string' ? val.trim() : '';
}

function cleanStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((v) => cleanString(v)).filter((v) => v.length > 0);
}

const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;

/**
 * Performs strict semantic validation of a ProjectPRD candidate object.
 * Returns sanitized and typed ProjectPRD if valid, or a descriptive error message.
 */
export function validateProjectPRD(raw: unknown): PRDValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { success: false, error: 'PRD payload must be a non-null object' };
  }

  const obj = raw as Record<string, unknown>;

  // 1. overview
  if (!obj.overview || typeof obj.overview !== 'object') {
    return { success: false, error: 'Missing or invalid "overview" object in PRD' };
  }
  const overviewObj = obj.overview as Record<string, unknown>;
  const productName = cleanString(overviewObj.productName);
  const summary = cleanString(overviewObj.summary);
  const problemStatement = cleanString(overviewObj.problemStatement);
  const proposedSolution = cleanString(overviewObj.proposedSolution);

  if (!productName || productName.length < 2) {
    return { success: false, error: 'Overview product name must be at least 2 characters' };
  }
  if (!summary || summary.length < 5) {
    return { success: false, error: 'Overview summary must be at least 5 characters' };
  }
  if (!problemStatement || problemStatement.length < 5) {
    return { success: false, error: 'Overview problem statement must be at least 5 characters' };
  }
  if (!proposedSolution || proposedSolution.length < 5) {
    return { success: false, error: 'Overview proposed solution must be at least 5 characters' };
  }

  // 2. goals & nonGoals
  const goals = cleanStringArray(obj.goals);
  if (goals.length === 0) {
    return { success: false, error: 'PRD must contain at least one goal' };
  }

  const nonGoals = cleanStringArray(obj.nonGoals);
  if (nonGoals.length === 0) {
    return { success: false, error: 'PRD must contain at least one non-goal to clarify scope' };
  }

  // 3. targetUsers
  if (!obj.targetUsers || typeof obj.targetUsers !== 'object') {
    return { success: false, error: 'Missing or invalid "targetUsers" object in PRD' };
  }
  const targetUsersObj = obj.targetUsers as Record<string, unknown>;
  const primaryUsers = cleanStringArray(targetUsersObj.primary);
  const secondaryUsers = cleanStringArray(targetUsersObj.secondary);

  if (primaryUsers.length === 0) {
    return { success: false, error: 'At least one primary target user persona is required' };
  }

  // 4. userNeeds
  const userNeeds = cleanStringArray(obj.userNeeds);
  if (userNeeds.length === 0) {
    return { success: false, error: 'PRD must contain at least one user need' };
  }

  // 5. userStories
  if (!Array.isArray(obj.userStories) || obj.userStories.length === 0) {
    return { success: false, error: 'PRD must contain at least one user story' };
  }

  const sanitizedUserStories: ProjectPRD['userStories'] = [];
  for (let i = 0; i < obj.userStories.length; i++) {
    const item = obj.userStories[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `User story at index ${i} must be an object` };
    }
    const story = item as Record<string, unknown>;
    const id = cleanString(story.id) || `US-${i + 1}`;
    const title = cleanString(story.title);
    const asA = cleanString(story.asA);
    const iWant = cleanString(story.iWant);
    const soThat = cleanString(story.soThat);

    if (!title) {
      return { success: false, error: `User story #${i + 1} (${id}) is missing a title` };
    }
    if (!asA) {
      return { success: false, error: `User story #${i + 1} (${id}) is missing "asA"` };
    }
    if (!iWant) {
      return { success: false, error: `User story #${i + 1} (${id}) is missing "iWant"` };
    }
    if (!soThat) {
      return { success: false, error: `User story #${i + 1} (${id}) is missing "soThat"` };
    }

    sanitizedUserStories.push({ id, title, asA, iWant, soThat });
  }

  // 6. functionalRequirements
  if (!Array.isArray(obj.functionalRequirements) || obj.functionalRequirements.length === 0) {
    return { success: false, error: 'PRD must contain at least one functional requirement' };
  }

  const sanitizedFunctionalRequirements: ProjectPRD['functionalRequirements'] = [];
  for (let i = 0; i < obj.functionalRequirements.length; i++) {
    const item = obj.functionalRequirements[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Functional requirement at index ${i} must be an object` };
    }
    const req = item as Record<string, unknown>;
    const id = cleanString(req.id) || `FR-${i + 1}`;
    const title = cleanString(req.title);
    const description = cleanString(req.description);
    const rawPriority = cleanString(req.priority).toLowerCase();

    if (!title) {
      return { success: false, error: `Functional requirement #${i + 1} (${id}) is missing a title` };
    }
    if (!description) {
      return { success: false, error: `Functional requirement #${i + 1} (${id}) is missing a description` };
    }
    if (!VALID_PRIORITIES.includes(rawPriority as 'low' | 'medium' | 'high')) {
      return {
        success: false,
        error: `Functional requirement #${i + 1} (${id}) has invalid priority "${rawPriority}". Must be low, medium, or high`,
      };
    }

    sanitizedFunctionalRequirements.push({
      id,
      title,
      description,
      priority: rawPriority as 'low' | 'medium' | 'high',
    });
  }

  // 7. nonFunctionalRequirements
  if (!Array.isArray(obj.nonFunctionalRequirements) || obj.nonFunctionalRequirements.length === 0) {
    return { success: false, error: 'PRD must contain at least one non-functional requirement' };
  }

  const sanitizedNonFunctionalRequirements: ProjectPRD['nonFunctionalRequirements'] = [];
  for (let i = 0; i < obj.nonFunctionalRequirements.length; i++) {
    const item = obj.nonFunctionalRequirements[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Non-functional requirement at index ${i} must be an object` };
    }
    const nfr = item as Record<string, unknown>;
    const id = cleanString(nfr.id) || `NFR-${i + 1}`;
    const category = cleanString(nfr.category) || 'Performance / Reliability';
    const requirement = cleanString(nfr.requirement);

    if (!requirement) {
      return { success: false, error: `Non-functional requirement #${i + 1} (${id}) is missing requirement text` };
    }

    sanitizedNonFunctionalRequirements.push({ id, category, requirement });
  }

  // 8. constraints & assumptions
  const constraints = cleanStringArray(obj.constraints);
  if (constraints.length === 0) {
    return { success: false, error: 'PRD must contain at least one constraint' };
  }

  const assumptions = cleanStringArray(obj.assumptions);
  if (assumptions.length === 0) {
    return { success: false, error: 'PRD must contain at least one assumption' };
  }

  // 9. successMetrics
  if (!Array.isArray(obj.successMetrics) || obj.successMetrics.length === 0) {
    return { success: false, error: 'PRD must contain at least one success metric' };
  }

  const sanitizedSuccessMetrics: ProjectPRD['successMetrics'] = [];
  for (let i = 0; i < obj.successMetrics.length; i++) {
    const item = obj.successMetrics[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Success metric at index ${i} must be an object` };
    }
    const m = item as Record<string, unknown>;
    const metric = cleanString(m.metric);
    const target = cleanString(m.target);
    const measurement = cleanString(m.measurement);

    if (!metric) {
      return { success: false, error: `Success metric #${i + 1} is missing a metric name` };
    }
    if (!target) {
      return { success: false, error: `Success metric #${i + 1} is missing a target` };
    }
    if (!measurement) {
      return { success: false, error: `Success metric #${i + 1} is missing a measurement method` };
    }

    sanitizedSuccessMetrics.push({ metric, target, measurement });
  }

  // 10. risks
  if (!Array.isArray(obj.risks) || obj.risks.length === 0) {
    return { success: false, error: 'PRD must contain at least one risk entry' };
  }

  const sanitizedRisks: ProjectPRD['risks'] = [];
  for (let i = 0; i < obj.risks.length; i++) {
    const item = obj.risks[i];
    if (!item || typeof item !== 'object') {
      return { success: false, error: `Risk at index ${i} must be an object` };
    }
    const r = item as Record<string, unknown>;
    const title = cleanString(r.title);
    const description = cleanString(r.description);
    const mitigation = cleanString(r.mitigation);

    if (!title) {
      return { success: false, error: `Risk #${i + 1} is missing a title` };
    }
    if (!description) {
      return { success: false, error: `Risk #${i + 1} is missing a description` };
    }
    if (!mitigation) {
      return { success: false, error: `Risk #${i + 1} is missing a mitigation plan` };
    }

    sanitizedRisks.push({ title, description, mitigation });
  }

  // 11. generatedAt
  let generatedAt = cleanString(obj.generatedAt);
  if (!generatedAt || isNaN(Date.parse(generatedAt))) {
    generatedAt = new Date().toISOString();
  }

  return {
    success: true,
    data: {
      overview: {
        productName,
        summary,
        problemStatement,
        proposedSolution,
      },
      goals,
      nonGoals,
      targetUsers: {
        primary: primaryUsers,
        secondary: secondaryUsers,
      },
      userNeeds,
      userStories: sanitizedUserStories,
      functionalRequirements: sanitizedFunctionalRequirements,
      nonFunctionalRequirements: sanitizedNonFunctionalRequirements,
      constraints,
      assumptions,
      successMetrics: sanitizedSuccessMetrics,
      risks: sanitizedRisks,
      generatedAt,
    },
  };
}
