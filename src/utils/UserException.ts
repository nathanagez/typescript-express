import { HttpException } from "@utils/HttpException";

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `User with id: ${id} not found`);
  }
}

class UserAlreadyExist extends HttpException {
  constructor(email: string) {
    super(500, `Email address ${email} is already used`);
  }
}

export { UserNotFoundException, UserAlreadyExist };
