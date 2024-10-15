import clsx from "clsx"; // for conditional classnames
import { twMerge } from "tailwind-merge"; // for merging tailwind classnames
import animationData from "@/assets/lottie-json"; // path to your animation data

// Function to merge classnames
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Color definitions
export const colors = [
  "bg-[#712ca457] text-[#ff006faa] border-[1px] border-[#ff006bba]",
  "bg-[#f6a2da] text-[#ff006faa] border-[1px] border-[#ff006bba]",
  "bg-[#4cc9f0bb] text-[#4cc9f0bb] border-[1px] border-[#4cc9f0bb]"
];

// Function to get color based on index
export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};

// Animation default options
export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData
};
