import prisma from "../prisma";

export const findUser = async (username: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: username }, { email: email }] },
  });
  return user
};

export const findPromotor = async (name: string, email: string) => {
  const promotor = await prisma.promotor.findFirst({
    where: { OR: [{ name: name }, { email: email }] },
  });
  return promotor
};

export const findRefCode = async (refCode: string) => {
  const code = await prisma.user.findFirst({ where: { refCode: refCode } });
  return code;
};