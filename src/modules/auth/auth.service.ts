import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { LoginUser } from "./auth.interface";
const loginUserDB = async (payload: LoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const accessToken = await jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expire_in as any,
    },
  );
  const refreshToken = await jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expire_in as any,
    },
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};
const RefreshTokentCreateDB = async (refreshToken: string) => {
  const verifydRefreshToken = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret,
  ) as JwtPayload;
  if (!verifydRefreshToken) {
    throw new Error("Token invalid");
  }
  const { id } = verifydRefreshToken;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (user.activeStatus === "INACTIVE") {
    throw new Error("user is inactive or block!");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expire_in,
  } as SignOptions);
  return { accessToken };
};
export const authService = {
  loginUserDB,
  RefreshTokentCreateDB,
};
