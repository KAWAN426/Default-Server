import { TypedRequest, TypedResponse } from "@/types/express";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { IUser } from "@/models/User";
import axios from "axios";

/**
 * verifyToken이 적용된 라우터는 Authorization과 provider를 해더에서 필요로 함
 * @param {string} Authorization
 * @param {string} provider
 * @return req.body.user에 사용자의 정보를 담아서 보내줌
 */
export const verifyToken = (isHeaderRequiredPresent = true) => {
  // * isHeaderRequiredPresent 값이 false일 경우 header에 authHeader, provider가 없어도 에러를 발생시키지 않음
  return async function (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;
    const provider = req.headers.provider || "google";

    if (isHeaderRequiredPresent && (!authHeader || !provider)) {
      next(new Error("Header value is missing"));
      return;
    } else if (!authHeader || !provider) {
      next();
      return;
    }

    try {
      const token = authHeader.split(" ")[1];
      const SECRET_KEY = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        next(new Error("Missing secret key"));
        return;
      }

      const userPayload = await getPayload(provider, token);

      if (userPayload instanceof Error) {
        next(userPayload);
        return;
      }
      req.body.user = userPayload;
      next();
      return;
    } catch (err) {
      next(err);
    }
  };
};

const getPayload = async (provider: string | string[], token: string) => {
  if (provider === "google") {
    const url = "https://www.googleapis.com/oauth2/v3/userinfo";

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });

    const { sub, name, picture, email } = response.data;
    if (!response) {
      return new Error("Missing payload.");
    }
    return {
      name,
      email,
      picture,
      authProvider: provider,
      providerId: sub,
    };
  } else {
    // jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    //   if (err) throw err; // 에러 발생 시 catch 블록으로 이동
    //   userPayload = decoded; // 디코딩된 JWT 페이로드
    // });
  }

  return new Error("Unsupported auth provider.");
};
