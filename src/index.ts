import express, { NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
import cors from "cors";
import loginRoutes from "@/routers/LoginRoutes";
import connectDB from "./lib/mongodb/connect";
import { TypedRequest, TypedResponse } from "./types/express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(helmet());

app.use(
  (err: Error, req: TypedRequest, res: TypedResponse, _next: NextFunction) => {
    console.error(`ERROR - ${req.originalUrl}: ${err.message}`);
    res.status(500).send({
      data: null,
      message: err.message,
      status: "error",
    });
  }
);

app.use("/api/login", loginRoutes);

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
