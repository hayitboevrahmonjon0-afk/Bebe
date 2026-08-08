import express from "express";
import cors from "cors";
import "dotenv/config";

import prisma from "./lib/prisma.js";
import { validateTelegramInitData } from "./services/telegramAuth.js";

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

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({
        success: false,
        message: "Telegram bot token serverda sozlanmagan",
      });
    }

    const result = validateTelegramInitData(
      initData,
      botToken
    );

    if (!result.valid || !result.user) {
      return res.status(401).json({
        success: false,
        message: "Telegram ma'lumotlari noto‘g‘ri yoki muddati tugagan",
      });
    }

    const telegramUser = result.user;

    const referralCode = `tg_${telegramUser.id}`;

    const user = await prisma.user.upsert({
      where: {
        telegramId: BigInt(telegramUser.id),
      },

      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.photo_url,
      },

      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.photo_url,
        balance: 1000,
        referralCode,
      },
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        balance: user.balance,
        level: user.level,
        experience: user.experience,
        dailyStreak: user.dailyStreak,
      },
    });
  } catch (error) {
    console.error("Telegram auth error:", error);

    return res.status(500).json({
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
