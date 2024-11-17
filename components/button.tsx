import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

export default function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
}) {
  return (
    <button
      className={cn(
        "px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
