import { type HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span className={cn("inline-flex rounded-full bg-earth-100 px-2.5 py-1 text-xs font-semibold text-earth-700", className)} {...props} />; }
