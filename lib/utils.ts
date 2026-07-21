import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Coordinate } from "@/types";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const formatHectares = (value: number) => `${value.toLocaleString("es-EC", { maximumFractionDigits: 2 })} ha`;
export function polygonAreaHa(points: Coordinate[]): number {
  if (points.length < 3) return 0;
  const lat0 = points.reduce((sum, p) => sum + p.lat, 0) / points.length * Math.PI / 180;
  const metersPerLat = 111_320, metersPerLng = 111_320 * Math.cos(lat0);
  let area = 0;
  for (let i = 0; i < points.length; i++) { const a = points[i], b = points[(i + 1) % points.length]; area += (a.lng * metersPerLng) * (b.lat * metersPerLat) - (b.lng * metersPerLng) * (a.lat * metersPerLat); }
  return Math.abs(area / 2) / 10_000;
}
