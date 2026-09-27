import { ImageResponse } from "next/og";
import { themeColors } from "@/lib/theme";

/** Iconița PLACEHOLDER pentru ecranul de start iOS (aceeași formă ca app/icon.svg). Se înlocuiește cu logo-ul. */
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
        <div style={{ width: 80, height: 80, borderRadius: 9999, backgroundColor: colors.accent }} />
      </div>
    ),
    size,
  );
}
