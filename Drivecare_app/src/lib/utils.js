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

export const getByPath = (obj, path) => {
  const value = path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  return value == null ? "" : String(value);
};

export const setByPath = (obj, path, value) => {
  const keys = path.split(".");
  const next = { ...obj };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...(cursor[keys[i]] ?? {}) };
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
};

export const stripUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  );
};
