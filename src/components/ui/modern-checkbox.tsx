
import * as React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const ModernCheckbox = React.forwardRef<
  HTMLButtonElement,
  ModernCheckboxProps
>(({ id, checked, onCheckedChange, label, className, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-3">
      <button
        ref={ref}
        type="button"
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-aumatia-blue focus:ring-offset-2",
          checked
            ? "bg-aumatia-blue text-white shadow-lg scale-110"
            : "bg-white border-2 border-gray-300 hover:border-aumatia-blue hover:bg-aumatia-blue/5",
          "hover:scale-105 animate-bounce-in",
          className
        )}
        {...props}
      >
        {checked ? (
          <CheckCircle className="w-4 h-4 animate-bounce-in" />
        ) : (
          <Circle className="w-4 h-4 opacity-50" />
        )}
      </button>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none cursor-pointer select-none hover:text-aumatia-blue transition-colors"
          onClick={() => onCheckedChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
});

ModernCheckbox.displayName = "ModernCheckbox";
