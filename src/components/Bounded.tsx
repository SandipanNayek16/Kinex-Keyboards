import { type ReactNode, type HTMLAttributes } from "react";
import clsx from "clsx";

type BoundedProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "footer" | "div" | "article" | "aside" | "main";
  fullWidth?: boolean;
  innerClassName?: string;
  children?: ReactNode;
};

export function Bounded({
  as: Comp = "section",
  fullWidth = false,
  className,
  innerClassName,
  children,
  ...rest
}: BoundedProps) {
  return (
    <Comp
      className={clsx("px-6 py-10 md:py-20", className)}
      {...rest}
    >
      <div
        className={clsx(
          "mx-auto w-full",
          !fullWidth && "max-w-7xl",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Comp>
  );
}
