import { NextRequest, NextResponse } from 'next/server';
import { generatePRDWithGemini, GeneratePRDInput } from '@/lib/ai-service';
import { validateProjectAnalysis } from '@/lib/analysis-validator';
import { validateProjectPRD } from '@/lib/prd-validator';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const raw = body as Record<string, unknown>;

    // 1. Validate Phase 2 analysis requirement first
    if (!raw.analysis || typeof raw.analysis !== 'object') {
      return NextResponse.json(
        { error: 'Project Analysis is required before generating the PRD.' },
        { status: 400 }
      );
    }

    const analysisValidation = validateProjectAnalysis(raw.analysis);
    if (!analysisValidation.success) {
      return NextResponse.json(
        { error: `Project Analysis is invalid: ${analysisValidation.error}. Project Analysis is required before generating the PRD.` },
        { status: 400 }
      );
    }

    // 2. Validate project metadata
    // Can be sent directly as { name, description, idea, ... } or as { project: { name, ... }, analysis }
    const projectSource =
      raw.project && typeof raw.project === 'object'
        ? (raw.project as Record<string, unknown>)
        : raw;

    if (typeof projectSource.name !== 'string' || !projectSource.name.trim()) {
      return NextResponse.json(
        { error: 'Project "name" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const name = projectSource.name.trim();

    if (typeof projectSource.description !== 'string' || !projectSource.description.trim()) {
      return NextResponse.json(
        { error: 'Project "description" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const description = projectSource.description.trim();

    if (typeof projectSource.idea !== 'string' || !projectSource.idea.trim()) {
      return NextResponse.json(
        { error: 'Project "idea" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const idea = projectSource.idea.trim();

    let targetUsers: string | undefined = undefined;
    if (projectSource.targetUsers !== undefined && projectSource.targetUsers !== null) {
      if (typeof projectSource.targetUsers === 'string') {
        targetUsers = projectSource.targetUsers.trim();
      }
    }

    let tags: string[] | undefined = undefined;
    if (Array.isArray(projectSource.tags)) {
      tags = projectSource.tags
        .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t) => t.trim());
    }

    const input: GeneratePRDInput = {
      project: {
        name,
        description,
        idea,
        targetUsers,
        tags,
      },
      analysis: analysisValidation.data,
    };

    // 3. Generate PRD with Gemini 3.8 Flash
    const prd = await generatePRDWithGemini(input);

    // 4. Stale Data Protection: The server derives and enforces sourceAnalysisGeneratedAt
    // directly from the verified analysis used as input, preventing client spoofing.
    prd.sourceAnalysisGeneratedAt = analysisValidation.data.generatedAt;

    // 5. Verify validation of result
    const prdValidation = validateProjectPRD(prd);
    if (!prdValidation.success) {
      console.error('Generated PRD failed post-validation:', prdValidation.error);
      return NextResponse.json(
        { error: `Generated PRD failed validation: ${prdValidation.error}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ prd: prdValidation.data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during PRD generation.';
    console.error('Error in /api/prd route:', message);

    if (message.includes('GEMINI_API_KEY is not configured')) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server. Please check your environment secrets.' },
        { status: 503 }
      );
    }

    if (message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Gemini API rate limit reached. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: message || 'Failed to generate PRD. Please try again.' },
      { status: 500 }
    );
  }
}
