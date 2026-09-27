import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "header" | "footer" | "nav";
};

/** Lățimea maximă a conținutului (max-w-site) + marginile laterale. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-site px-gutter md:px-gutter-lg", className)} {...props} />;
}
