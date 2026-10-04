import { ImageResponse } from "next/og";
import { symbolShapes, symbolViewBox } from "@/components/brand/logo-shapes";
import { themeColors } from "@/lib/theme";

/** Iconița pentru ecranul de start iOS: simbolul Creos în accent, pe fundalul închis al cardurilor (ca app-icon-negru-rosu din brand kit). */
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
          backgroundColor: colors.surface,
        }}
      >
        <svg width={104} height={(104 * symbolViewBox.height) / symbolViewBox.width} viewBox={`0 0 ${symbolViewBox.width} ${symbolViewBox.height}`}>
          {symbolShapes.map((d) => (
            <path key={d} d={d} fill={colors.accent} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
