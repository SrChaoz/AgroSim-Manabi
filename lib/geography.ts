import type { Coordinate } from "@/types";

export interface LandSuitability { isCultivable: boolean; advice: string }

// Simplified Manabí coastline. Points west of this line are treated as Pacific Ocean.
// This is a first-pass protection, not a replacement for an official cadastral layer.
const manabiCoastline: Coordinate[] = [
  { lat: -0.05, lng: -80.13 }, { lat: -0.25, lng: -80.25 }, { lat: -0.5, lng: -80.4 },
  { lat: -0.75, lng: -80.46 }, { lat: -0.95, lng: -80.67 }, { lat: -1.15, lng: -80.76 },
  { lat: -1.4, lng: -80.77 }, { lat: -1.7, lng: -80.68 }
];

function coastLongitudeAt(latitude: number): number | null {
  for (let index = 1; index < manabiCoastline.length; index++) {
    const north = manabiCoastline[index - 1], south = manabiCoastline[index];
    if (latitude <= north.lat && latitude >= south.lat) {
      const ratio = (latitude - north.lat) / (south.lat - north.lat);
      return north.lng + ratio * (south.lng - north.lng);
    }
  }
  return null;
}

export function validateParcelLand(points: Coordinate[]): LandSuitability {
  if (points.length < 3) return { isCultivable: false, advice: "Delimita al menos tres puntos para validar la aptitud geográfica del terreno." };
  const centroid = points.reduce((total, point) => ({ lat: total.lat + point.lat / points.length, lng: total.lng + point.lng / points.length }), { lat: 0, lng: 0 });
  const samples = [...points, centroid];
  const seaPoint = samples.find(point => { const coast = coastLongitudeAt(point.lat); return coast !== null && point.lng < coast; });
  if (seaPoint) return { isCultivable: false, advice: "La parcela seleccionada intersecta una zona marítima del Pacífico. Elige un terreno en tierra firme antes de ejecutar la simulación." };
  return { isCultivable: true, advice: "Ubicación terrestre general validada. Confirma límites, pendiente y calidad de suelo con un técnico local." };
}
