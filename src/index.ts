import express, { NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
dotenv.config();
if (process.env.NODE_ENV === "production") {
  require("module-alias/register");
}
// import cors from "@/middleware/cors";
import cors from "cors";
import loginRoutes from "@/routers/LoginRoutes";
import broadcastRoutes from "@/routers/BroadcastRoutes";
import voteRoutes from "@/routers/VoteRoutes";
import pointPredictionsRoutes from "@/routers/PointPredictionsRoutes";
import userRoutes from "@/routers/UserRoutes";
import pointRoutes from "@/routers/PointRoutes";
import connectDB from "./lib/mongodb/connect";
import { ApiResponse, TypedRequest, TypedResponse } from "./types/express";

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

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running`);
});
