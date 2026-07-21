"use client";
import { useMapEvents } from "react-leaflet"; import type { Coordinate } from "@/types";
export function PolygonDrawer({ onPoint }: { onPoint: (point: Coordinate) => void }) { useMapEvents({ click(event) { onPoint({ lat: event.latlng.lat, lng: event.latlng.lng }); } }); return null; }
