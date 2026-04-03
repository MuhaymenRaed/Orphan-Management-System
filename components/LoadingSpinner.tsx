function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  // Define sizes for better reuse across the dashboard
  const sizes = {
    sm: "h-8 w-8 border-4",
    md: "h-16 w-16 md:h-24 md:w-24 border-8",
    lg: "h-32 w-32 border-[10px]",
  };

  return (
    <div className="flex min-h-[200px] w-full flex-1 items-center justify-center p-4">
      <div
        className={`
          ${sizes[size]} 
          animate-spin rounded-full 
          border-[var(--primeColor)] 
          border-t-transparent
        `}
      />
    </div>
  );
}

export default LoadingSpinner;
