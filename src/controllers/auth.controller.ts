import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { Controller } from "./controller";
import { IUser } from "@interfaces/user.interface";
import { UserModel } from "./users/users.model";
import { UserAlreadyExist } from "@utils/UserException";
import { HttpException } from "@utils/HttpException";
import { TokenData, DataStoredInToken } from "../interfaces/token.interface";

class AuthenticationController extends Controller<IUser> {
  constructor() {
    super("auth", UserModel);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.register.bind(this));
    this.router.post(`${this.path}/login`, this.login.bind(this));
  }

  private async register(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const userData: IUser = request.body;
    try {
      const data = await this.model.findOne({ email: userData.email });
      if (data !== null) next(new UserAlreadyExist(userData.email));
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.model.create({
          ...userData,
          password: hashedPassword
        });
        user.password = undefined;
        const tokenData = this.createToken(user);
        response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        response.send(user).status(200);
      } catch (error) {
        next(new HttpException(500, `Somethings went wrong: ${error}`));
      }
    } catch (error) {
      next(new HttpException(500, `Somethings went wrong ${error}`));
    }
  }

  private async login(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const userData: IUser = request.body;
    try {
      const user = await this.model.findOne({ email: userData.email });
      if (user) {
        const isPasswordMatching = await bcrypt.compare(
          userData.password,
          user.password
        );
        if (isPasswordMatching) {
          user.password = undefined;
          const tokenData = this.createToken(user);
          response.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
          response.send(user);
        } else {
          next(new HttpException(500, "Somethings went wrong"));
        }
      }
    } catch (error) {
      next(new HttpException(500, "Somethings went wrong"));
    }
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: IUser): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }
}

export { AuthenticationController };
