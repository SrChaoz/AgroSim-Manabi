import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { agroPlanJsonSchema, agroPlanSchema } from "@/lib/schemas";
import { validateParcelLand } from "@/lib/geography";
export const runtime = "nodejs";
const instruction = "Eres AgroSim Manabí, un agrónomo de precisión. Responde exclusivamente al esquema solicitado. Regionaliza para Manabí, Ecuador: cacao, café, plátano, maíz y yuca; considera monilia, escoba de bruja y mancha de hierro. Cada recomendación debe tener trazabilidad concreta en justificacion_trazable. Incluye siempre ODS 2, ODS 12 y ODS 15 y una advertencia explícita de validar con un técnico agrónomo.";
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Configura OPENAI_API_KEY para ejecutar la simulación." }, { status: 503 });
    const input = await request.json();
    const suitability = validateParcelLand(input.parcel?.coordinates ?? []);
    if (!suitability.isCultivable) return NextResponse.json({ error: suitability.advice }, { status: 422 });
    const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", response_format: { type: "json_schema", json_schema: agroPlanJsonSchema }, messages: [{ role: "system", content: instruction }, { role: "user", content: `Simula este escenario: ${JSON.stringify(input)}` }] });
    const output = agroPlanSchema.parse(JSON.parse(completion.choices[0]?.message.content ?? "{}"));
    return NextResponse.json(output);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No fue posible simular." }, { status: 400 }); }
}
