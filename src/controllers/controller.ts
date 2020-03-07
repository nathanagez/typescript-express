import * as express from "express";
import { Document, Model } from "mongoose";

class Controller<T> {
  public path: string = null;
  public router: express.Router = express.Router();
  protected model: Model<T & Document>;

  constructor(path: string, model: Model<T & Document>) {
    this.path = `/${path}`;
    this.model = model;
  }
}

export { Controller };
