import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./lib/prisma.js";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Spin the Bottle API ishlayapti 🚀",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      success: false,
      status: "error",
      database: "disconnected",
    });
  }
});

app.post("/api/auth/telegram", async (req, res) => {
  try {
    const { initData } = req.body;

    if (!initData || typeof initData !== "string") {
      return res.status(400).json({
        success: false,
        message: "Telegram initData yuborilmadi",
      });
    }

    res.json({
      success: true,
      message: "Telegram ma'lumoti qabul qilindi",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server xatosi",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Spin the Bottle API http://localhost:${PORT} manzilida ishga tushdi`
  );
});
