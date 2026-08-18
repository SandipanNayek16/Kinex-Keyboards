import Image from "next/image";

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`} {...props}>
      <Image 
        src="/logo.png" 
        alt="Kinex Mascot" 
        width={32}
        height={32}
        className="h-full w-auto object-contain scale-[1.7]"
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }}
      />
      <span className="font-black-slanted tracking-tighter text-2xl uppercase text-[#01A7E1] pt-1">
        Kinex
      </span>
    </div>
  );
}
