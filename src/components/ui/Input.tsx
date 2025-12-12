import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type, ...props }, ref) => {
    
    // State để quản lý ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    
    // Nếu type là password và đang bật show -> đổi thành text
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-xs font-semibold text-muted ml-1 uppercase">{label}</label>}
        
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-surface border-2 border-transparent rounded-2xl px-5 py-3.5 text-foreground outline-none transition-all font-medium placeholder:text-muted/60",
              "focus:border-primary focus:bg-background",
              error && "border-destructive/50 bg-destructive/5",
              className
            )}
            {...props}
          />

          {/* Logic hiển thị nút con mắt */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              tabIndex={-1} // Không focus vào nút này khi tab
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {error && <span className="text-xs text-destructive font-bold ml-1">{error}</span>}
      </div>
    );
  }
);