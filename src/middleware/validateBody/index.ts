import { TypedRequest, TypedResponse } from "@/types/express";
import { NextFunction } from "express";

export function validateAndBody(requiredKeys: string[]) {
  return function (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
  ): void {
    const missingKeys = requiredKeys.filter((key) => !(key in req.body));
    if (missingKeys.length > 0) {
      const missingKeysString = missingKeys.join(", ");
      next(new Error(`Missing required fields: ${missingKeysString}`));
      return;
    }
    next();
  };
}

export function validateOrBody(requiredKeys: string[]) {
  return function (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
  ): void {
    const isAnyKeyPresent = requiredKeys.some((key) => key in req.body);
    if (!isAnyKeyPresent) {
      next(
        new Error(
          `At least one of the required fields must be present: ${requiredKeys.join(
            ", "
          )}`
        )
      );
      return;
    }
    next();
  };
}

export function validateOneBody(requiredKeys: string) {
  return function (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
  ): void {
    const isAnyKeyPresent = requiredKeys in req.body;
    if (!isAnyKeyPresent) {
      next(
        new Error(
          `At least one of the required fields must be present: ${requiredKeys}`
        )
      );
      return;
    }
    next();
  };
}
