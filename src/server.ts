import "module-alias/register";
import * as dotenv from "dotenv";
import App from "./app";
import { UsersController } from "@controllers/users/users.controller";
import { AuthenticationController } from "@controllers/auth.controller";

dotenv.config();
const app = new App([new UsersController(), new AuthenticationController()]);

app.listen();
