import { ImageResponse } from "next/og";
import { brand, hero } from "@/content/site";
import { ogFonts, themeColors } from "@/lib/theme";

/** Imaginea de share (Facebook, LinkedIn, WhatsApp, X): fundal dark, numele brandului, tagline-ul din hero. */
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
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -0.7, color: colors.foreground }}>
          {brand.name}
        </div>
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
