import { BarChart3, Medal, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SimulationInput, SuggestedZone } from "@/types";

const cropProfile: Record<string, { soils: string[]; rainfall: string[]; summary: string }> = {
  Arroz: { soils: ["Arcilloso", "Franco"], rainfall: ["Lluvias intensas", "Estación habitual"], summary: "Aprovecha suelos con buena retención de agua y requiere drenaje controlado." },
  Cacao: { soils: ["Franco", "Arcilloso"], rainfall: ["Estación habitual", "Lluvias intensas"], summary: "Sistema perenne compatible con sombra, cobertura y manejo de humedad." },
  Café: { soils: ["Franco"], rainfall: ["Estación habitual"], summary: "Se adapta mejor con cobertura, sombra regulada y buen drenaje." },
  Plátano: { soils: ["Franco", "Arcilloso"], rainfall: ["Estación habitual", "Lluvias intensas"], summary: "Aporta cosecha escalonada si existe disponibilidad hídrica y drenaje." },
  Maíz: { soils: ["Franco", "Arenoso"], rainfall: ["Estación habitual"], summary: "Ciclo corto útil para rotación, con atención a humedad durante floración." },
  Yuca: { soils: ["Arenoso", "Franco"], rainfall: ["Déficit de lluvias", "Estación habitual"], summary: "Alternativa tolerante para diversificar en sectores más secos y drenados." }
};

function rating(crop: string, preferred: string, input: SimulationInput): number {
  const profile = cropProfile[crop] ?? { soils: [], rainfall: [], summary: "Alternativa a validar según el microclima y análisis de suelo." };
  const soilFit = profile.soils.includes(input.soilType) ? 14 : 2;
  const rainfallFit = profile.rainfall.includes(input.rainfallScenario) ? 10 : 1;
  const irrigationFit = input.irrigationChange >= 0 ? (crop === "Arroz" || crop === "Plátano" ? 5 : 2) : (crop === "Yuca" ? 7 : 1);
  return Math.min(98, (crop === preferred ? 72 : 53) + soilFit + rainfallFit + irrigationFit);
}

export function CropAlternatives({ zones, input }: { zones: SuggestedZone[]; input: SimulationInput }) {
  if (zones.length === 0) return null;
  return <Card><div className="mb-1 flex items-center gap-2"><BarChart3 size={18} className="text-earth-700"/><h2 className="font-bold text-earth-900">Alternativas de cultivo por zona</h2></div><p className="mb-5 text-sm text-slate-500">Compatibilidad orientativa según suelo, lluvia y riego del escenario actual; valida el resultado con un técnico.</p><div className="grid gap-5 lg:grid-cols-3">{zones.map((zone, zoneIndex) => { const candidates = Array.from(new Set([zone.cultivo_recomendado, "Arroz", "Cacao", "Maíz", "Yuca", "Plátano"])).map(crop => ({ crop, score: rating(crop, zone.cultivo_recomendado, input) })).sort((a, b) => b.score - a.score).slice(0, 4); const top = candidates[0]; return <article className="rounded-xl border border-earth-100 p-4" key={zone.nombre_zona}><div className="mb-3 flex items-start justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wide text-earth-700">{zone.nombre_zona}</p><h3 className="flex items-center gap-1 font-semibold text-earth-900"><Medal size={16} className="text-amber-500"/>{top.crop} · {top.score}%</h3></div><span className="rounded-full bg-earth-100 px-2 py-1 text-xs text-earth-700">Prioridad {zoneIndex + 1}</span></div><p className="mb-4 text-sm text-slate-600">{cropProfile[top.crop]?.summary ?? "Recomendación generada para las condiciones de esta zona."}</p><ul className="space-y-3">{candidates.map(candidate => <li key={candidate.crop}><div className="mb-1 flex justify-between text-xs"><span className="flex items-center gap-1 font-medium text-slate-700"><Sprout size={12}/>{candidate.crop}</span><span>{candidate.score}%</span></div><div className="h-2 overflow-hidden rounded-full bg-earth-100"><div className="h-full rounded-full bg-earth-500" style={{ width: `${candidate.score}%` }}/></div></li>)}</ul></article>; })}</div></Card>;
}
