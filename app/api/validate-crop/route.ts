import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { cropValidationJsonSchema, cropValidationSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Configura OPENAI_API_KEY para validar el cultivo." }, { status: 503 });
    const { crop } = await request.json() as { crop?: string };
    const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", response_format: { type: "json_schema", json_schema: cropValidationJsonSchema }, messages: [{ role: "system", content: "Eres un validador agronómico para Manabí, Ecuador. Determina si la entrada es el nombre de un cultivo real, no una plaga, herramienta, suelo ni texto ambiguo. Si es un cultivo, normaliza su nombre en español. Devuelve solo el JSON solicitado." }, { role: "user", content: `Entrada de cultivo: ${crop ?? ""}` }] });
    return NextResponse.json(cropValidationSchema.parse(JSON.parse(completion.choices[0]?.message.content ?? "{}")));
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible validar el cultivo." }, { status: 400 }); }
}
