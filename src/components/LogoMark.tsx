export function LogoMark({ className, ...props }: React.HTMLAttributes<HTMLImageElement>) {
  return (
    <img 
      src="/logo.png" 
      alt="Kinex Mascot" 
      className={`object-contain scale-[1.7] ${className || ""}`}
      style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
      {...props}
    />
  );
}
