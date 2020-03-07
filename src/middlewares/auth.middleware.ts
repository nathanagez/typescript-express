import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { RequestWithUser } from "@interfaces/requestWithUser.interface";
import { UserModel } from "@controllers/users/users.model";
import { DataStoredInToken } from "@interfaces/token.interface";
import { HttpException } from "@utils/HttpException";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException(401, "Wrong auth token"));
      }
    } catch (error) {
      next(new HttpException(401, "Wrong auth token"));
    }
  } else {
    next(new HttpException(401, "Missing auth token"));
  }
}

export { authMiddleware };
