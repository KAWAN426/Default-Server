import { IUser } from "@/models/User";
import { TypedRequest, TypedResponse } from "@/types/express";
import * as service from "@/services/userService";
import { NextFunction } from "express";

export const loginUserGoogle = async (
  req: TypedRequest<{}, { user: IUser }>,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    const user = req.body.user;
    await service.upsertUser(user);
    res.status(200).send({
      data: null,
      message: "새로운 사용자를 생성했습니다",
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
