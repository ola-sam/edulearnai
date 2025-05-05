import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 60) {
    return "just now";
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function getInitials(firstName: string, lastName: string): string {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

export function calculateProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getGradeDisplay(grade: number): string {
  return `Grade ${grade}`;
}

export function generateDifficultyStars(difficulty: number): string[] {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < difficulty ? "filled" : "empty");
  }
  return stars;
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    "Mathematics": "primary",
    "English": "warning",
    "Science": "success",
    // Default to primary if subject not found
    "default": "primary"
  };
  
  return colors[subject] || colors.default;
}

export function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    "Mathematics": "calculate",
    "English": "menu_book",
    "Science": "science",
    // Default to school if subject not found
    "default": "school"
  };
  
  return icons[subject] || icons.default;
}
