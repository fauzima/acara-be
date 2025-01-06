
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.1.0
 * Query Engine version: 11f085a2012c0f4778414c8db2651556ee0ef959
 */
Prisma.prismaVersion = {
  client: "6.1.0",
  engine: "11f085a2012c0f4778414c8db2651556ee0ef959"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  avatar: 'avatar',
  refCode: 'refCode',
  inputRef: 'inputRef',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PromotorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  avatar: 'avatar',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  desc: 'desc',
  category: 'category',
  location: 'location',
  venue: 'venue',
  startDate: 'startDate',
  endDate: 'endDate',
  thumbnail: 'thumbnail',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  promotorId: 'promotorId'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  category: 'category',
  desc: 'desc',
  seats: 'seats',
  remainingSeats: 'remainingSeats',
  price: 'price',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  eventId: 'eventId'
};

exports.Prisma.UserPointScalarFieldEnum = {
  id: 'id',
  point: 'point',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiredAt: 'expiredAt',
  status: 'status',
  userId: 'userId',
  orderId: 'orderId'
};

exports.Prisma.UserCouponScalarFieldEnum = {
  id: 'id',
  percentage: 'percentage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiredAt: 'expiredAt',
  status: 'status',
  userId: 'userId',
  orderId: 'orderId'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  totalPrice: 'totalPrice',
  finalPrice: 'finalPrice',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiredAt: 'expiredAt',
  userId: 'userId',
  eventId: 'eventId'
};

exports.Prisma.OrderDetailsScalarFieldEnum = {
  id: 'id',
  qty: 'qty',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  orderId: 'orderId',
  ticketId: 'ticketId'
};

exports.Prisma.AttendeeTicketScalarFieldEnum = {
  id: 'id',
  isAttended: 'isAttended',
  orderDetailsId: 'orderDetailsId'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  description: 'description',
  rating: 'rating',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId',
  eventId: 'eventId',
  attendeeTicketId: 'attendeeTicketId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.EventCategory = exports.$Enums.EventCategory = {
  Konser: 'Konser',
  Festival: 'Festival',
  Pertandingan: 'Pertandingan',
  Pameran: 'Pameran',
  Konferensi: 'Konferensi',
  Workshop: 'Workshop',
  Seminar: 'Seminar',
  Pelatihan: 'Pelatihan',
  Sertifikasi: 'Sertifikasi'
};

exports.EventLocation = exports.$Enums.EventLocation = {
  Jakarta: 'Jakarta',
  Bandung: 'Bandung',
  Yogyakarta: 'Yogyakarta',
  Surabaya: 'Surabaya',
  Solo: 'Solo',
  Medan: 'Medan',
  Bali: 'Bali'
};

exports.BonusStatus = exports.$Enums.BonusStatus = {
  Available: 'Available',
  isRedeemed: 'isRedeemed',
  Expired: 'Expired'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  Pending: 'Pending',
  Paid: 'Paid',
  Cancelled: 'Cancelled',
  Expired: 'Expired'
};

exports.Prisma.ModelName = {
  User: 'User',
  Promotor: 'Promotor',
  Event: 'Event',
  Ticket: 'Ticket',
  UserPoint: 'UserPoint',
  UserCoupon: 'UserCoupon',
  Order: 'Order',
  OrderDetails: 'OrderDetails',
  AttendeeTicket: 'AttendeeTicket',
  Review: 'Review'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
