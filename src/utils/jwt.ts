import jwt from "jsonwebtoken";
const verifyToken = (token: string, secret: string) => {
  try {
    const verifyedToken = jwt.verify(token, secret);
    return verifyedToken;
  } catch (error: any) {
    console.log("Token verification faild", error);
    throw new Error("invalid Token");
  }
};

export const jwtUtils = {
  verifyToken,
};
