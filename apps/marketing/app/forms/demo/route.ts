import { demoRequestSchema, fieldErrors } from "@/lib/schemas";

/**
 * PLACEHOLDER endpoint: validates the demo request and logs it.
 * TODO: forward to your CRM / email / the YatriDesk backend before launch.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = demoRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    // A filled honeypot is a bot: pretend success so it learns nothing.
    if (errors.website) return Response.json({ ok: true });
    return Response.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  const { name, phone, restaurant, city, businessType } = parsed.data;
  console.info("[demo-request]", { name, phone, restaurant, city, businessType, receivedAt: new Date().toISOString() });

  return Response.json({ ok: true });
}
