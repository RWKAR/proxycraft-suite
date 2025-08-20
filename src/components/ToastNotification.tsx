import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "error" | "success" | "info" | "bulk" | "output";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastNotificationProps extends Toast {
  onDismiss: (id: string) => void;
  index: number;
}

export const ToastNotification = ({ 
  id, 
  type, 
  message, 
  duration = 5000, 
  onDismiss,
  index 
}: ToastNotificationProps) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        setIsVisible(false);
        setTimeout(() => onDismiss(id), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, id, onDismiss, startTime]);

  const getToastStyles = () => {
    switch (type) {
      case "error":
        return "bg-card border-toast-error/30 text-foreground";
      case "success":
        return "bg-card border-toast-success/30 text-foreground";
      case "info":
        return "bg-card border-toast-info/30 text-foreground";
      case "bulk":
        return "bg-card border-toast-bulk/30 text-foreground";
      case "output":
        return "bg-card border-toast-output/30 text-foreground";
      default:
        return "bg-card border-border text-foreground";
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case "error":
        return "bg-toast-error";
      case "success":
        return "bg-toast-success";
      case "info":
        return "bg-toast-info";
      case "bulk":
        return "bg-toast-bulk";
      case "output":
        return "bg-toast-output";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={cn(
        "fixed right-4 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 max-w-sm",
        getToastStyles(),
        isVisible ? "toast-enter" : "toast-exit"
      )}
      style={{
        top: `${80 + index * 80}px`,
        zIndex: 1000 + index,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-relaxed flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(id), 300);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30 rounded-b-lg overflow-hidden">
        <div
          className={cn("h-full transition-all duration-75 ease-linear", getProgressBarColor())}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};