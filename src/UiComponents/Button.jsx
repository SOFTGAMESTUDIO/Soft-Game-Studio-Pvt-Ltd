import * as React from "react";
import { cn } from "../Library/utils";

export const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
          "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 " +
          "disabled:opacity-50 disabled:pointer-events-none px-4 py-2 " +
          "bg-cyan-500 hover:bg-cyan-400 text-white dark:bg-cyan-600 dark:hover:bg-cyan-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";
