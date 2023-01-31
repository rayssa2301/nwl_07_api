import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

type IPayload = {
  sub: string;
};

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Complete aqui
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const decoded = verify(token, process.env.JWT_SECRET) as IPayload;
    console.log(decoded);

    const { sub } = decoded;

    request.user_id = sub;
    next();
  } catch (err) {
    return response.status(401).json({ errorCode: "token.expired" });
  }
}
