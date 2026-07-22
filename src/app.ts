import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";



import router from "./routes";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
const app: Application = express();

app.use(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
);

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
app.use(globalErrorHandler);

export default app;
