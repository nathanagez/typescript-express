import * as express from "express";
import { Controller } from "@controllers/controller";
import { IUser } from "@interfaces/user.interface";
import { UserModel } from "./users.model";
import { Document } from "mongoose";
import { HttpException } from "@utils/HttpException";
import { UserNotFoundException, UserAlreadyExist } from "@utils/UserException";
import { authMiddleware } from "@middlewares/auth.middleware";

class UsersController extends Controller<IUser> {
  constructor() {
    super("users", UserModel);
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.use(this.path, authMiddleware);
    this.router.get(this.path, this.getAllUsers.bind(this));
    this.router.get(`${this.path}/:id`, this.getUser.bind(this));
    this.router.patch(`${this.path}/:id`, this.editUser.bind(this));
    this.router.delete(`${this.path}/:id`, this.deleteUser.bind(this));
  }

  async getAllUsers(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const data = await UserModel.find().exec();
      response.send({ data }).status(200);
    } catch (error) {
      next(new HttpException(400, "Can't return users"));
    }
  }

  async getUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    try {
      const data = await UserModel.findById(id);
      response.send({ data }).status(200);
    } catch (error) {
      next(new UserNotFoundException(id));
    }
  }

  async editUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    const newUser: IUser & Document = request.body;
    try {
      const success = await this.model.findByIdAndUpdate(id, newUser, {
        new: true
      });
      if (success) response.send("updated").status(200);
      next(new HttpException(500, "Somethings went wrong"));
    } catch (error) {
      next(new HttpException(500, "Somethings went wrong"));
    }
  }

  async deleteUser(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    try {
      const success = await this.model.findByIdAndDelete(id);
      if (success) response.send("deleted").status(200);
      next(new UserNotFoundException(id));
    } catch (error) {
      console.log(error);
      next(new UserNotFoundException(id));
    }
  }
}

export { UsersController };
