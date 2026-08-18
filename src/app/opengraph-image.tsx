import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Mecha 16 - Kinex Keyboards";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #082f49, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            margin: 0,
            backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Mecha 16
        </h1>
        <p
          style={{
            fontSize: 40,
            fontWeight: 400,
            marginTop: 20,
            color: "#cbd5e1",
          }}
        >
          by Kinex Keyboards
        </p>
        <p
          style={{
            fontSize: 30,
            marginTop: 40,
            color: "#94a3b8",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          A premium 75% gasket-mount keyboard with hot-swap sockets, OLED display, and bespoke keycap colourways.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
