import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        className={cn('text-blue-600 dark:text-blue-400', sizes[size])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 9.5V5.5C21 4.4 20.1 3.5 19 3.5H5C3.9 3.5 3 4.4 3 5.5V9.5M21 9.5H3M21 9.5C21.5523 9.5 22 9.94772 22 10.5V18.5C22 19.6046 21.1046 20.5 20 20.5H4C2.89543 20.5 2 19.6046 2 18.5V10.5C2 9.94772 2.44772 9.5 3 9.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 15.5H17M12 12.5V18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn(
        'font-bold tracking-tight',
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
        }
      )}>
        WindSurf
      </span>
    </div>
  );
}

export function LogoIcon({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={cn('text-blue-600 dark:text-blue-400', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 9.5V5.5C21 4.4 20.1 3.5 19 3.5H5C3.9 3.5 3 4.4 3 5.5V9.5M21 9.5H3M21 9.5C21.5523 9.5 22 9.94772 22 10.5V18.5C22 19.6046 21.1046 20.5 20 20.5H4C2.89543 20.5 2 19.6046 2 18.5V10.5C2 9.94772 2.44772 9.5 3 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 15.5H17M12 12.5V18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}