import mongoose, { Schema, model } from "mongoose"
import cron from "node-cron"
import { ISocketOrder } from "./socket.order.interface"

const SocketOrderSchema = new Schema<ISocketOrder>(
  {
    pickUpCode: { type: Number },
    numberOfTrips: { type: Number, default: 1 },
    daysOfEvent: { type: Number },
    assignedRider: { type: mongoose.Types.ObjectId, ref: "Rider" },
    orderId: { type: String },
    pickUp: { type: Boolean, default: false },
    isWallet: { type: Boolean, default: false },
    isEvent: { type: Boolean, default: false },
    isBulk: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    deliveryAddress: { type: String },
    delivered: { type: Boolean, default: false },
    note: { type: String },
    itemId: [
      {
        _id: { type: mongoose.Types.ObjectId, ref: "Item" },
        quantity: { type: Number },
        price: { type: Number },
        day: { type: Date },
        date: { type: Date },
        period: { type: String },
        preferredTime: { type: String },
        delivered: { type: Boolean, default: false },
        scheduleStatus: {
          type: String,
          enum: [
            "pending",
            "accepted",
            "on-going",
            "in-transit",
            "ready",
            "arrived",
            "cancelled",
            "picked",
            "completed",
          ],
          default: "pending",
        },
      },
    ],
    transactionId: { type: mongoose.Types.ObjectId, ref: "Transaction" },
    scheduleId: { type: mongoose.Types.ObjectId, ref: "Subscription" },
    orderedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    vendorId: { type: mongoose.Types.ObjectId, ref: "Vendor" },
    userEmail: { type: String },
    userName: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "on-going",
        "in-transit",
        "ready",
        "arrived",
        "cancelled",
        "picked",
        "completed",
      ],
      default: "pending",
    },
    riderStatus: {
      type: String,
      enum: ["arrived"],
    },
    orderDate: { type: Date },
    startDate: { type: Date },
    totalDistance: { type: Number, default: 0 },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    schedule: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    isDelete: { type: Boolean, default: false },
    paymentResponse: { type: String },
    ridersFee: { type: Number },
    netAmount: { type: Number },
    totalAmount: { type: Number },
    serviceCharge: { type: Number },
    confirmDelivery: { type: Boolean, default: false },
    remarks: { type: String },
    isConfirmed: { type: Boolean, default: false },
    delivery: { type: Boolean },
    readyTime: { type: String },
    paymentIntentId: { type: String },
    eventDescription: { type: String },
    eventLocation: { type: String },
    locationCoord: {
      type: { type: String },
      coordinates: [],
    },
  },
  { timestamps: true },
)

SocketOrderSchema.index({ locationCoord: "2dsphere" })

const socketOrder = model<ISocketOrder>(
  "SocketOrder",
  SocketOrderSchema,
  "socketOrder",
)

// Define a cron job to run every day at a specific time (e.g., midnight)
cron.schedule("0 0 * * *", async () => {
  try {
    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Delete orders where isConfirmed is false and createdAt is before sevenDaysAgo
    const result = await socketOrder.deleteMany({
      isConfirmed: false,
      createdAt: { $lt: sevenDaysAgo },
    })

    console.log(`Deleted ${result.deletedCount} orders older than 7 days.`)
  } catch (error) {
    console.error("Error deleting orders:", error)
  }
})

export default socketOrder
