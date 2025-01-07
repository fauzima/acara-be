import prisma from "../prisma";

export const ScheduledTasks = async () => {
  const now = new Date();

  const order = await prisma.order.findMany({
    where: { AND: { expiredAt: { lte: now }, status: "Pending" } },
  });

  await prisma.order.updateMany({
    data: { status: "Expired" },
    where: { AND: { expiredAt: { lte: now }, status: "Pending" } },
  });

  if (order) {
    for (const item of order) {
      await prisma.userPoint.updateMany({
        data: { orderId: null },
        where: { orderId: item.id },
      });

      await prisma.userCoupon.updateMany({
        data: { orderId: null },
        where: { orderId: item.id },
      });

      //reset jatah tiket di record ticket dari tiap orderDetails
      const orderDetails = await prisma.orderDetails.findMany({
        where: { orderId: item.id },
        select: { id: true, qty: true, ticketId: true },
      });

      for (const item of orderDetails) {
        await prisma.ticket.update({
          data: { remainingSeats: { increment: item.qty } },
          where: { id: item.ticketId },
        });
      }
    }
  }

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
