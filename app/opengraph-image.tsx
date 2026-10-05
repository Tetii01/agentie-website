import { ImageResponse } from "next/og";
import { logoSymbolShapes, logoViewBox, logoWordmarkShapes } from "@/components/brand/logo-shapes";
import { brand } from "@/content/site";
import { themeColors } from "@/lib/theme";

/** Imaginea de share (iMessage, WhatsApp, Facebook, LinkedIn, X): logo-ul mare, centrat, pe fundal dark. */
export const alt = brand.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Lățimea logo-ului în imagine; înălțimea urmează proporția din logo-shapes. */
const LOGO_WIDTH = 760;

export default function OpengraphImage() {
  const colors = themeColors();
  const logoHeight = (LOGO_WIDTH * logoViewBox.height) / logoViewBox.width;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.glow}, transparent 60%)`,
        }}
      >
        <svg width={LOGO_WIDTH} height={logoHeight} viewBox={`0 0 ${logoViewBox.width} ${logoViewBox.height}`}>
          {logoWordmarkShapes.map((d) => (
            <path key={d} d={d} fill={colors.foreground} />
          ))}
          {logoSymbolShapes.map((d) => (
            <path key={d} d={d} fill={colors.accent} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
