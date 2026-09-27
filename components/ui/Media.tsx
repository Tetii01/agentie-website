import Image from "next/image";
import type { ImageRef } from "@/content/site";
import { cn } from "@/lib/cn";
import { aspects, Placeholder, shapes, type PlaceholderProps } from "./Placeholder";

type MediaProps = PlaceholderProps & {
  /** Imaginea reală din content/site.ts. `null` → se afișează Placeholder-ul. */
  image: ImageRef;
  /** Lățimea afișată, pentru next/image (ex. „(min-width: 1024px) 33vw, 100vw"). */
  sizes: string;
  /** Pentru imaginea din primul ecran (hero): se încarcă imediat, cu prioritate. */
  eager?: boolean;
};

/** Imagine prin next/image dacă există, altfel blocul Placeholder, cu aceeași formă și proporție. */
export function Media({ image, sizes, eager = false, ...placeholder }: MediaProps) {
  if (!image) return <Placeholder {...placeholder} />;

  const { shape = "rounded", aspect = "landscape", className } = placeholder;
  return (
    <div className={cn("relative overflow-hidden", shapes[shape], aspects[aspect], className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className="object-cover"
      />
    </div>
  );
}
