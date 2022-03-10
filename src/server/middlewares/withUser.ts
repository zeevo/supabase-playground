import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface UserRequest extends NextRequest {
  user: any;
  headers: Headers & { authorization: string };
}

export default function middleware(handler: any) {
  return async (req: UserRequest, res: NextResponse) => {
    const authUser = jwt.verify(
      req.headers?.authorization?.split(" ")[1] ?? "",
      process.env.JWT_SECRET ?? ""
    );
    req.user = authUser;
    return handler(req, res);
  };
}

export type { UserRequest };
