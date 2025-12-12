import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, variant = 'primary', isLoading, children, ...props 
}) => {
  
  const baseStyles = "w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center active:scale-95 disabled:opacity-70 shadow-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 hover:shadow-blue-500/20",
    outline: "border-2 border-border bg-transparent text-foreground hover:bg-surface hover:border-primary/50",
    ghost: "bg-transparent text-muted hover:text-foreground hover:bg-surface"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};