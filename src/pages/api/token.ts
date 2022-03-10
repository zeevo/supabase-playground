import type { NextApiResponse } from "next";
import withUser, { UserRequest } from "../../server/middlewares/withUser";
import jwt from "jsonwebtoken";

async function handler(req: UserRequest, res: NextApiResponse) {
  const token = jwt.sign(
    { sub: req.user.sub, email: req.user.email },
    process.env.JWT_SECRET
  );
  res.status(200).json({ token });
}

export default withUser(handler);
