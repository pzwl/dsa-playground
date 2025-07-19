import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          type="range"
          className={cn(
            "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
            "slider:bg-blue-500 slider:rounded-lg slider:cursor-pointer",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500",
            "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg",
            "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
