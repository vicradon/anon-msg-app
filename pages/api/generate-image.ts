// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Canvas from "canvas";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const message = req.body.message;
    const isDarkTheme = req.body.theme === "dark";
    const exportPath = isDarkTheme
      ? "public/export-template/dark-background.png"
      : "public/export-template/light-background.png";

    // Create a new canvas with the same dimensions as the template image
    const maxWidth = 736;

    const canvas = Canvas.createCanvas(maxWidth, 275);
    const ctx = canvas.getContext("2d");

    // Load the template image and draw it onto the canvas
    const template = new Canvas.Image();
    template.src = fs.readFileSync(exportPath);
    ctx.drawImage(template, 0, 0);

    // Add some text to the image
    ctx.font = "18px Arial";
    ctx.fillStyle = isDarkTheme ? "#ffffff" : "#000000";
    ctx.textAlign = "left";

    let line = "";
    let lines = [];

    // Split the text into lines that fit within the maximum width
    const words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth - 100 && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw the lines of text onto the canvas
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 50, 50 + i * 50);
    }

    const pngBuffer = canvas.toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(pngBuffer);
  } else {
    res.status(404).send("Not found");
  }
}
