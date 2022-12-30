import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

function splitText(text: string, width: number) {
  const lines = [];
  let line = "";

  for (let i = 0; i < text.length; i++) {
    line += text[i];
    if (line.length >= width) {
      lines.push(line);
      line = "";
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }

  return lines;
}

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }

  const requestBody = await req.json();

  const rawMessage = requestBody.message;
  const message = splitText(rawMessage || "No message sent", 65);
  const isDarkTheme = requestBody.theme === "dark";

  const darkBackground =
    "https://user-images.githubusercontent.com/40396070/210067756-84af180a-9fba-4af1-87ac-4bb24178dafc.png";
  const lightBackground =
    "https://user-images.githubusercontent.com/40396070/210067761-eec4fa4b-ebf8-4d33-9cfb-67bf714f693b.png";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: isDarkTheme ? "#000000" : "#ffffff",
          display: "flex",
          position: "relative",
          borderRadius: "5px",
        }}
      >
        <img
          style={{
            height: "100%",
            width: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          src={isDarkTheme ? darkBackground : lightBackground}
          alt=""
        />
        <div
          style={{
            color: isDarkTheme ? "#ffffff" : "#000000",
            fontSize: "20px",
            fontFamily: "Arial",
            fontWeight: "bold",
            lineHeight: "2",
            textAlign: "center",
            position: "absolute",
            left: "20px",
            top: "20px",
            display: "flex",
          }}
        >
          {message.map((line, index) => {
            return (
              <p
                style={{
                  position: "absolute",
                  top: `${index * 30}px`,
                }}
                key={index}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    ),
    {
      width: 736,
      height: 275,
    }
  );
}
