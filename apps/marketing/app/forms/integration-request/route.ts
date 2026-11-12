import { fieldErrors, integrationRequestSchema } from "@/lib/schemas";

/**
 * PLACEHOLDER endpoint: validates an integration request and logs it.
 * TODO: store requests (sheet, CRM or backend) before launch.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = integrationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.website) return Response.json({ ok: true });
    return Response.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  const { name, contact, category, details } = parsed.data;
  console.info("[integration-request]", { name, contact, category, details, receivedAt: new Date().toISOString() });

  return Response.json({ ok: true });
}
