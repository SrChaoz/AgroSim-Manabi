export type Severity = "Baja" | "Media" | "Alta";
export interface Coordinate { lat: number; lng: number }
export interface Parcel { coordinates: Coordinate[]; areaHa: number }
export interface SuggestedZone { nombre_zona: string; area_proporcional_ha: number; cultivo_recomendado: string; justificacion_agroecologica: string }
export interface SimulationInput { crop: string; soilType: string; irrigationChange: number; rainfallScenario: string; parcel: Parcel | null }
export interface CropValidation { isCrop: boolean; normalizedCrop: string; reason: string }
export interface EvidenceDiagnosis { cultivo_detectado: string; problema_principal: string; severidad: Severity; resumen_analisis: string; hallazgos_visuales: string[]; acciones_inmediatas: string[]; advertencia_legal: string }
export interface DiagnosisChatMessage { role: "user" | "assistant"; content: string }
export interface AgroPlan {
  diagnostico_inicial: { cultivo_detectado: string; problema_principal: string; severidad: Severity; resumen_analisis: string };
  simulacion_impacto: { descripcion_escenario: string; impacto_rendimiento_proyectado: string; justificacion_trazable: string };
  geometria_parcelas_sugerida: { area_total_ha: number; subdivisiones: SuggestedZone[] };
  plan_accion: { pasos_inmediatos: string[]; recomendaciones_riego_inteligente: string[]; recomendaciones_suelo_resiliencia: string[] };
  ods_impactados: ["ODS 2", "ODS 12", "ODS 15"];
  advertencia_legal: string;
}
