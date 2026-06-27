import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { CreateUser, IupdatePrfile } from "./user.interface";

const registerUserDB = async (payload: CreateUser) => {
  const { name, email, password, profilePhoto } = payload;
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    throw new Error("User already exists");
  }
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
      email: createUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};
const getUserProfileDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};
const updateProfileDB = async (payload: IupdatePrfile, userId: string) => {
  const { profilePhoto, bio } = payload;
  const result = await prisma.profile.update({
    data: {
      profilePhoto,
      bio,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
    where: {
      userId,
    },
  });
  return result;
};

export const userServices = {
  registerUserDB,
  getUserProfileDB,
  updateProfileDB,
};
