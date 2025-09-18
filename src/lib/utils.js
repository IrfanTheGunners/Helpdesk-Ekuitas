import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn = merge classnames (dipakai di button dsb)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
