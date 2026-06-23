import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import config from "./config";
import httpstatus from "http-status";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./modules/user/user.routes";
import { Auth } from "./middleware/Auth";
export const app: Application = express();

app.use(cors({ origin: config.app_url, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", userRoutes);

app.get("/", Auth(), async (req: Request, res: Response) => {
  res.send("Hello World!");
});
