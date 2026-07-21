export type Severity = "Baja" | "Media" | "Alta";
export interface Coordinate { lat: number; lng: number }
export interface Parcel { coordinates: Coordinate[]; areaHa: number }
export interface SimulationInput { crop: string; soilType: string; irrigationChange: number; rainfallScenario: string; parcel: Parcel | null }
export interface AgroPlan {
  diagnostico_inicial: { cultivo_detectado: string; problema_principal: string; severidad: Severity; resumen_analisis: string };
  simulacion_impacto: { descripcion_escenario: string; impacto_rendimiento_proyectado: string; justificacion_trazable: string };
  geometria_parcelas_sugerida: { area_total_ha: number; subdivisiones: { nombre_zona: string; area_proporcional_ha: number; cultivo_recomendado: string; justificacion_agroecologica: string }[] };
  plan_accion: { pasos_inmediatos: string[]; recomendaciones_riego_inteligente: string[]; recomendaciones_suelo_resiliencia: string[] };
  ods_impactados: ["ODS 2", "ODS 12", "ODS 15"];
  advertencia_legal: string;
}
