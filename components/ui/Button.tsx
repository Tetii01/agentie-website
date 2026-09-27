import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartLink } from "./SmartLink";

const variants = {
  /** Fundal accent, glow în culoarea accentului la hover. */
  primary: "bg-accent text-accent-foreground hover:shadow-glow",
  secondary: "border border-border bg-surface-2 text-foreground hover:border-foreground/30",
  /** Link discret, fără fundal. */
  ghost: "text-muted hover:text-foreground",
};

const sizes = {
  lg: "h-14 px-8 text-base",
  md: "h-12 px-6 text-base",
  sm: "h-10 px-5 text-sm",
  /** Doar iconiță: pune obligatoriu aria-label. */
  icon: "size-10",
};

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps | "href"> & { href: string };
type ButtonAsButton = CommonProps & Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: never };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function buttonClasses(variant: CommonProps["variant"] = "primary", size: CommonProps["size"] = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,box-shadow] duration-base ease-smooth",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

/**
 * Buton tip pilulă. Cu `href` devine link (ancorele „#secțiune" fac scroll lin),
 * fără `href` e un <button>.
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, href, ...rest } = props;
    return <SmartLink href={href} className={buttonClasses(variant, size, className)} {...rest} />;
  }

  const { variant, size, className, type = "button", ...rest } = props;
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}
