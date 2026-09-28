import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartLink } from "./SmartLink";

const variants = {
  /** Pilulă lucioasă în culoarea de accent (utilitatea button-glossy); glow mai puternic la hover. */
  primary: "button-glossy hover:brightness-110",
  /** Pilulă albă cu text închis (butonul din hero). */
  light: "bg-foreground text-background hover:bg-foreground/90",
  /** Pilulă închisă, cu contur fin. */
  secondary: "border border-border bg-surface-2 text-foreground hover:border-foreground/30",
  /** Link discret, fără fundal. */
  ghost: "text-muted hover:text-foreground",
};

const sizes = {
  /** Butonul mare din hero: text + săgeată într-un cerc, lipită de marginea din dreapta. */
  cta: "h-14 gap-4 pr-2 pl-7 text-base md:h-16 md:gap-5 md:pl-8 md:text-lg",
  lg: "h-14 gap-2 px-8 text-base",
  md: "h-12 gap-2 px-6 text-base",
  sm: "h-10 gap-2 px-5 text-sm",
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
    "inline-flex shrink-0 items-center justify-center rounded-pill font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,box-shadow,filter] duration-base ease-smooth",
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
