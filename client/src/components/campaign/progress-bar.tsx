import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: string;
  className?: string;
}

export function ProgressBar({ 
  value, 
  color = "primary", 
  className 
}: ProgressBarProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(Math.max(0, value), 100);
  
  // Use specific color if provided, otherwise fall back to primary
  const barColor = color ? `bg-${color}-500` : "bg-primary-500";
  
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div 
        className={cn("h-2 rounded-full", barColor)} 
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
