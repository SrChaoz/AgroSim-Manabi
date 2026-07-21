import { NextRequest, NextResponse } from "next/server";
import type OpenAI from "openai";
import { openai } from "@/lib/openai";
import { agroPlanJsonSchema, agroPlanSchema } from "@/lib/schemas";
export const runtime = "nodejs";
const instruction = "Eres un agrónomo experto en Manabí, Ecuador. Analiza la evidencia de cultivo y devuelve SOLO el JSON estructurado. Incluye diagnóstico regional de cacao, café, plátano, maíz o yuca, con atención a monilia, escoba de bruja y mancha de hierro. La justificacion_trazable debe nombrar la foto/audio y cada variable recibida. Incluye ODS 2, ODS 12, ODS 15 y advierte que un técnico agrónomo debe validar en campo.";
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Configura OPENAI_API_KEY para ejecutar el diagnóstico." }, { status: 503 });
    const form = await request.formData(); const image = form.get("image"); const note = String(form.get("note") ?? "Sin nota de campo");
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [{ type: "text", text: `Nota del productor: ${note}` }];
    if (image instanceof File && image.size > 0) { const base64 = Buffer.from(await image.arrayBuffer()).toString("base64"); content.push({ type: "image_url", image_url: { url: `data:${image.type || "image/jpeg"};base64,${base64}` } }); }
    const completion = await openai.chat.completions.create({ model: "gpt-4o", response_format: { type: "json_schema", json_schema: agroPlanJsonSchema }, messages: [{ role: "system", content: instruction }, { role: "user", content }] });
    return NextResponse.json(agroPlanSchema.parse(JSON.parse(completion.choices[0]?.message.content ?? "{}")));
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible diagnosticar." }, { status: 400 }); }
}
