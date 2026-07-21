import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title: "AgroSim Manabí", description: "Simulación agronómica para pequeños productores de Manabí, Ecuador." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
