"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, Play, RotateCcw } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ControlPanel } from "@/components/simulation/ControlPanel";
import { CropAlternatives } from "@/components/simulation/CropAlternatives";
import { InputMedia } from "@/components/simulation/InputMedia";
import { ResultsDashboard } from "@/components/simulation/ResultsDashboard";
import { polygonAreaHa } from "@/lib/utils";
import type { AgroPlan, Coordinate, SimulationInput } from "@/types";

const MapCanvas = dynamic(() => import("@/components/map/MapContainer").then(module => module.MapCanvas), {
  ssr: false,
  loading: () => <div className="h-[410px] animate-pulse rounded-2xl bg-earth-100" />
});

const initial: SimulationInput = { crop: "Cacao", soilType: "Franco", irrigationChange: 0, rainfallScenario: "Estación habitual", parcel: null };

export default function Home() {
  const [input, setInput] = useState<SimulationInput>(initial);
  const [result, setResult] = useState<AgroPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const updatePoints = (coordinates: Coordinate[]) => setInput(value => ({ ...value, parcel: { coordinates, areaHa: polygonAreaHa(coordinates) } }));

  async function simulate() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "Error al simular."); } finally { setLoading(false); }
  }

  async function diagnose(file: File | null, note: string) {
    setLoading(true); setError("");
    try {
      const form = new FormData(); if (file) form.append("image", file); form.append("note", note);
      const response = await fetch("/api/diagnose", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "Error al diagnosticar."); } finally { setLoading(false); }
  }

  const zones = result?.geometria_parcelas_sugerida.subdivisiones ?? [];
  return <><Header/><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="mb-7 max-w-3xl"><p className="mb-2 text-sm font-semibold uppercase tracking-widest text-earth-700">Manabí · Ecuador</p><h2 className="text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">Convierte tu parcela en decisiones más resilientes.</h2><p className="mt-3 text-slate-600">Dibuja el terreno, modela riego y clima, o aporta una fotografía para recibir un plan trazable.</p></div><div className="grid gap-5 lg:grid-cols-[350px_1fr]"><aside className="space-y-5"><ControlPanel input={input} onChange={setInput}/><InputMedia loading={loading} onDiagnose={diagnose}/></aside><div className="space-y-5"><Card><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 font-bold text-earth-900"><MapPin size={18}/> Delimita tu parcela</h2><p className="text-sm text-slate-500">Haz clic en el mapa para añadir vértices.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => { setInput(value => ({ ...value, parcel: null })); setResult(null); }}><RotateCcw size={16}/></Button><Button disabled={loading || !input.parcel || input.parcel.coordinates.length < 3} onClick={simulate} className="gap-2"><Play size={16}/>{loading ? "Simulando…" : "Ejecutar simulación"}</Button></div></div><MapCanvas parcel={input.parcel} zones={zones} onChange={updatePoints}/></Card>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<ResultsDashboard result={result}/>{result && <CropAlternatives zones={zones} input={input}/>}</div></div></main><Footer/></>;
}
