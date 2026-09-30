import { ImageResponse } from "next/og";
import { logoDot, logoShapes, symbolViewBox } from "@/components/brand/logo-shapes";
import { themeColors } from "@/lib/theme";

/** Iconița pentru ecranul de start iOS: simbolul Creos (orbita + punctul), ca în app/icon.svg. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const colors = themeColors();

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
        }}
      >
        <svg width={104} height={(104 * symbolViewBox.height) / symbolViewBox.width} viewBox={`0 0 ${symbolViewBox.width} ${symbolViewBox.height}`}>
          <path d={logoShapes[0]} fill={colors.foreground} />
          <circle {...logoDot} fill={colors.accent} />
        </svg>
      </div>
    ),
    size,
  );
}
