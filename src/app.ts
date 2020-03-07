import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cookieParser from "cookie-parser";
import Controller from "@interfaces/controller.interface";
import { errorMiddleware } from "@middlewares/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT || 3000, () => {
      console.log(`App listening on the port ${process.env.PORT || 3000}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  }
}

export default App;
