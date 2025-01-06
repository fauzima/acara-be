import prisma from "../prisma";

export const ScheduledTasks = async () => {
  const now = new Date();

  await prisma.order.updateMany({
    data: { status: "Expired" },
    where: { AND: { expiredAt: { lte: now }, status: "Pending" } },
  });

  await prisma.userCoupon.updateMany({
    data: { status: "Expired" },
    where: { AND: { expiredAt: { lte: now }, status: "Available" } },
  });

  await prisma.userPoint.updateMany({
    data: { status: "Expired" },
    where: { AND: { expiredAt: { lte: now }, status: "Available" } },
  });

  console.log(`running cron job at ${now.toLocaleTimeString()}`);
};
