import express from "express";
import cors from "cors";
import "dotenv/config";

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

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "spin-the-bottle-backend",
  });
});

app.listen(PORT, () => {
  console.log(
    `Spin the Bottle API http://localhost:${PORT} manzilida ishga tushdi`
  );
});
