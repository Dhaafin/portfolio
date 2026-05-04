import React from 'react';
import { cn } from '@sglara/cn';

const Button = ({ className, children, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary: "glass text-foreground hover:bg-white/10",
    outline: "border border-border hover:bg-muted text-foreground"
  };

  return (
    <button
      className={cn(
        "px-6 py-2.5 rounded-full font-medium transition-all active:scale-95 duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
