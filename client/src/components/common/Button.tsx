import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'pink' | 'purple' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'lime',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-full select-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-bold',
  }[size];

  const variantClasses = {
    lime: 'bg-campus-lime text-black hover:bg-campus-lime-hover hover:shadow-glow shadow-sm font-bold',
    pink: 'bg-campus-pink text-white hover:bg-pink-600 hover:shadow-glow-pink font-bold',
    purple: 'bg-campus-purple text-white hover:bg-purple-600 hover:shadow-glow-purple font-bold',
    outline: 'border border-slate-700 bg-campus-card/60 text-slate-200 hover:border-slate-500 hover:bg-campus-card hover:text-white',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/60',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
