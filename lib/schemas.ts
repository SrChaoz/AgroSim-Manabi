import { z } from "zod";
export const agroPlanSchema = z.object({
  diagnostico_inicial: z.object({ cultivo_detectado: z.string(), problema_principal: z.string(), severidad: z.enum(["Baja", "Media", "Alta"]), resumen_analisis: z.string() }),
  simulacion_impacto: z.object({ descripcion_escenario: z.string(), impacto_rendimiento_proyectado: z.string(), justificacion_trazable: z.string() }),
  geometria_parcelas_sugerida: z.object({ area_total_ha: z.number().nonnegative(), subdivisiones: z.array(z.object({ nombre_zona: z.string(), area_proporcional_ha: z.number().nonnegative(), cultivo_recomendado: z.string(), justificacion_agroecologica: z.string() })) }),
  plan_accion: z.object({ pasos_inmediatos: z.array(z.string()), recomendaciones_riego_inteligente: z.array(z.string()), recomendaciones_suelo_resiliencia: z.array(z.string()) }),
  ods_impactados: z.tuple([z.literal("ODS 2"), z.literal("ODS 12"), z.literal("ODS 15")]), advertencia_legal: z.string()
});
export type AgroPlanOutput = z.infer<typeof agroPlanSchema>;
export const agroPlanJsonSchema = {
  name: "agro_plan_manabi", strict: true,
  schema: { type: "object", additionalProperties: false, properties: {
    diagnostico_inicial: { type: "object", additionalProperties: false, properties: { cultivo_detectado: { type: "string" }, problema_principal: { type: "string" }, severidad: { type: "string", enum: ["Baja", "Media", "Alta"] }, resumen_analisis: { type: "string" } }, required: ["cultivo_detectado", "problema_principal", "severidad", "resumen_analisis"] },
    simulacion_impacto: { type: "object", additionalProperties: false, properties: { descripcion_escenario: { type: "string" }, impacto_rendimiento_proyectado: { type: "string" }, justificacion_trazable: { type: "string" } }, required: ["descripcion_escenario", "impacto_rendimiento_proyectado", "justificacion_trazable"] },
    geometria_parcelas_sugerida: { type: "object", additionalProperties: false, properties: { area_total_ha: { type: "number" }, subdivisiones: { type: "array", items: { type: "object", additionalProperties: false, properties: { nombre_zona: { type: "string" }, area_proporcional_ha: { type: "number" }, cultivo_recomendado: { type: "string" }, justificacion_agroecologica: { type: "string" } }, required: ["nombre_zona", "area_proporcional_ha", "cultivo_recomendado", "justificacion_agroecologica"] } } }, required: ["area_total_ha", "subdivisiones"] },
    plan_accion: { type: "object", additionalProperties: false, properties: { pasos_inmediatos: { type: "array", items: { type: "string" } }, recomendaciones_riego_inteligente: { type: "array", items: { type: "string" } }, recomendaciones_suelo_resiliencia: { type: "array", items: { type: "string" } } }, required: ["pasos_inmediatos", "recomendaciones_riego_inteligente", "recomendaciones_suelo_resiliencia"] },
    ods_impactados: { type: "array", items: { type: "string", enum: ["ODS 2", "ODS 12", "ODS 15"] }, minItems: 3, maxItems: 3 }, advertencia_legal: { type: "string" }
  }, required: ["diagnostico_inicial", "simulacion_impacto", "geometria_parcelas_sugerida", "plan_accion", "ods_impactados", "advertencia_legal"] }
} as const;
