import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcrypt";
import router from "./routes";
import { notFound } from "./middlewares/notfound";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url || "*",
    credentials: true,
  }),
);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/api", router)

app.use(notFound);

export default app;
