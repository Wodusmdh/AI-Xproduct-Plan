import { NextRequest, NextResponse } from 'next/server';
import { analyzeProjectWithGemini, ProjectAnalysisInput } from '@/lib/ai-service';

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

    // Validate name
    if (typeof raw.name !== 'string' || !raw.name.trim()) {
      return NextResponse.json(
        { error: 'Project "name" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const name = raw.name.trim();
    if (name.length > 200) {
      return NextResponse.json(
        { error: 'Project "name" exceeds the maximum length of 200 characters.' },
        { status: 400 }
      );
    }

    // Validate description
    if (typeof raw.description !== 'string' || !raw.description.trim()) {
      return NextResponse.json(
        { error: 'Project "description" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const description = raw.description.trim();
    if (description.length > 1000) {
      return NextResponse.json(
        { error: 'Project "description" exceeds the maximum length of 1000 characters.' },
        { status: 400 }
      );
    }

    // Validate idea
    if (typeof raw.idea !== 'string' || !raw.idea.trim()) {
      return NextResponse.json(
        { error: 'Project "idea" is required and must be a non-empty string.' },
        { status: 400 }
      );
    }
    const idea = raw.idea.trim();
    if (idea.length < 10) {
      return NextResponse.json(
        { error: 'Project "idea" must be at least 10 characters long to produce meaningful analysis.' },
        { status: 400 }
      );
    }
    if (idea.length > 10000) {
      return NextResponse.json(
        { error: 'Project "idea" exceeds the maximum length of 10,000 characters.' },
        { status: 400 }
      );
    }

    // Validate targetUsers if present
    let targetUsers: string | undefined = undefined;
    if (raw.targetUsers !== undefined && raw.targetUsers !== null) {
      if (typeof raw.targetUsers !== 'string') {
        return NextResponse.json(
          { error: 'Project "targetUsers" must be a string if provided.' },
          { status: 400 }
        );
      }
      targetUsers = raw.targetUsers.trim();
      if (targetUsers.length > 1000) {
        return NextResponse.json(
          { error: 'Project "targetUsers" exceeds the maximum length of 1000 characters.' },
          { status: 400 }
        );
      }
    }

    // Validate tags if present
    let tags: string[] | undefined = undefined;
    if (raw.tags !== undefined && raw.tags !== null) {
      if (!Array.isArray(raw.tags)) {
        return NextResponse.json(
          { error: 'Project "tags" must be an array of strings if provided.' },
          { status: 400 }
        );
      }
      if (raw.tags.length > 30) {
        return NextResponse.json(
          { error: 'A maximum of 30 tags is supported.' },
          { status: 400 }
        );
      }
      tags = [];
      for (const t of raw.tags) {
        if (typeof t !== 'string') {
          return NextResponse.json(
            { error: 'All items in "tags" must be strings.' },
            { status: 400 }
          );
        }
        const cleaned = t.trim();
        if (cleaned.length > 50) {
          return NextResponse.json(
            { error: `Tag "${cleaned.slice(0, 20)}..." exceeds maximum length of 50 characters.` },
            { status: 400 }
          );
        }
        if (cleaned) {
          tags.push(cleaned);
        }
      }
    }

    const input: ProjectAnalysisInput = {
      name,
      description,
      idea,
      targetUsers,
      tags,
    };

    const analysis = await analyzeProjectWithGemini(input);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during project analysis.';
    console.error('Error in /api/analyze route:', message);

    // Provide safe user-facing message
    if (message.includes('GEMINI_API_KEY is not configured')) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your environment secrets.' },
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
      { error: message || 'Failed to complete project analysis. Please try again.' },
      { status: 500 }
    );
  }
}
