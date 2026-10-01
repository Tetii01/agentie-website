import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartLink } from "./SmartLink";

/** Apăsare cu „arc" (ca butonul liquid metal). Butonul nu se mută și nu crește la hover. */
const spring = "transition-[scale,box-shadow] duration-spring ease-overshoot active:scale-[0.97]";

const variants = {
  /** Liquid metal: interior închis cu un inel cromat care curge (utilitatea liquid-metal). */
  primary: cn("liquid-metal relative", spring),
  /** Butonul mare din hero: tot liquid metal, cu inelul puțin mai gros. */
  light: cn("liquid-metal relative [--metal-ring:2px]", spring),
  /** Pilulă închisă, cu contur metalic static (utilitatea metal-border). */
  secondary: cn("metal-border text-foreground", spring),
  /** Link discret, fără fundal. */
  ghost: "text-muted transition-colors duration-base ease-smooth hover:text-foreground",
};

const sizes = {
  /** Butonul mare din hero: text + săgeată într-un cerc, lipită de marginea din dreapta. */
  cta: "h-12 gap-3 pr-1.5 pl-5 text-sm md:h-16 md:gap-5 md:pr-2 md:pl-8 md:text-lg",
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
