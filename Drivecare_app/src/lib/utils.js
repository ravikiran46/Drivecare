import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getSlotDate = (slotLabel) => {
  if (!slotLabel) return new Date().toISOString().split("T")[0];

  const label = slotLabel.toLowerCase();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (label.includes("today")) {
    return today.toISOString().split("T")[0];
  }

  if (label.includes("tomorrow")) {
    return tomorrow.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
};
