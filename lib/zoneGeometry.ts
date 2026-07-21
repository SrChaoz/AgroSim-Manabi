import type { Coordinate, SuggestedZone } from "@/types";

export const zoneColors = ["#3e7d50", "#bf7a2a", "#3d78a8", "#86539b", "#b05050"];

function clipAtLongitude(points: Coordinate[], limit: number, keepLeft: boolean): Coordinate[] {
  const output: Coordinate[] = [];
  for (let index = 0; index < points.length; index++) {
    const current = points[index];
    const previous = points[(index + points.length - 1) % points.length];
    const currentInside = keepLeft ? current.lng <= limit : current.lng >= limit;
    const previousInside = keepLeft ? previous.lng <= limit : previous.lng >= limit;
    if (currentInside !== previousInside) {
      const ratio = (limit - previous.lng) / (current.lng - previous.lng);
      output.push({ lat: previous.lat + ratio * (current.lat - previous.lat), lng: limit });
    }
    if (currentInside) output.push(current);
  }
  return output;
}

/** Creates proportional west-to-east strips clipped to the farmer's polygon. */
export function createZonePolygons(parcel: Coordinate[], zones: SuggestedZone[]): Coordinate[][] {
  if (parcel.length < 3 || zones.length === 0) return [];
  const west = Math.min(...parcel.map(point => point.lng));
  const east = Math.max(...parcel.map(point => point.lng));
  const totalArea = zones.reduce((total, zone) => total + Math.max(zone.area_proporcional_ha, 0), 0) || zones.length;
  let boundary = west;
  return zones.map((zone, index) => {
    const nextBoundary = index === zones.length - 1 ? east : boundary + (east - west) * (Math.max(zone.area_proporcional_ha, 0) / totalArea);
    const strip = clipAtLongitude(clipAtLongitude(parcel, boundary, false), nextBoundary, true);
    boundary = nextBoundary;
    return strip;
  });
}
