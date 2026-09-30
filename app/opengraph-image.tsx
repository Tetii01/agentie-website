import { ImageResponse } from "next/og";
import { logoDot, logoShapes, logoViewBox } from "@/components/brand/logo-shapes";
import { brand, hero } from "@/content/site";
import { ogFonts, themeColors } from "@/lib/theme";

/** Imaginea de share (Facebook, LinkedIn, WhatsApp, X): fundal dark, logo-ul, tagline-ul din hero. */
export const alt = `${brand.name} · ${hero.title} ${hero.highlight}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const colors = themeColors();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: colors.background,
          backgroundImage: `radial-gradient(circle at 82% 18%, ${colors.glow}, transparent 55%)`,
          fontFamily: "Geist",
        }}
      >
        <svg
          width={(48 * logoViewBox.width) / logoViewBox.height}
          height={48}
          viewBox={`0 0 ${logoViewBox.width} ${logoViewBox.height}`}
        >
          {logoShapes.map((d) => (
            <path key={d} d={d} fill={colors.foreground} />
          ))}
          <circle {...logoDot} fill={colors.accent} />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1000,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3.5,
            color: colors.foreground,
          }}
        >
          <span>{hero.title}</span>
          <span style={{ color: colors.accent }}>{hero.highlight}</span>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
