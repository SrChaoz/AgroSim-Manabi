import { type HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={cn("rounded-2xl border border-earth-100 bg-white p-5 shadow-sm", className)} {...props} />; }
