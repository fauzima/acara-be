import prisma from "../prisma";

export const findUniqueUser = async (username: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });
  return user;
};

export const findbyRefCode = async (refCode: string) => {
  const code = await prisma.user.findFirst({ where: { refCode: refCode } });
  return code;
};
