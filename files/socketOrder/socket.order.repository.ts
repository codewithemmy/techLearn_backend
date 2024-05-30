import mongoose, { FilterQuery, UpdateQuery } from "mongoose"
import pagination, { IPagination } from "../../constants"
import { ISocketOrder } from "./socket.order.interface"
import SocketOrder from "./socket.order.model"
import { ICoord } from "../user/user.interface"
const { LIMIT, SKIP, SORT } = pagination

export default class SocketOrderRepository {
  static async createOrder(orderPayload: Partial<ISocketOrder>): Promise<ISocketOrder> {
    return SocketOrder.create(orderPayload)
  }

  static async fetchAllOrders(
    orderPayload: Partial<ISocketOrder> | FilterQuery<Partial<ISocketOrder>>,
  ) {
    const order = await SocketOrder.find({
      ...orderPayload,
    })
    return order
  }

  static async fetchOrder(
    orderPayload: Partial<ISocketOrder> | FilterQuery<Partial<ISocketOrder>>,
    select: Partial<Record<keyof ISocketOrder, number | Boolean | object>>,
  ): Promise<Partial<ISocketOrder> | null> {
    const order: Awaited<ISocketOrder | null> = await SocketOrder.findOne(
      {
        ...orderPayload,
      },
      select,
    ).lean()

    return order
  }

  static async updateOrderDetails(
    orderPayload: FilterQuery<Partial<ISocketOrder>>,
    update: UpdateQuery<Partial<ISocketOrder>>,
  ) {
    const updateOrder = await SocketOrder.findOneAndUpdate(
      {
        ...orderPayload,
      },
      { ...update },
      { new: true, runValidators: true },
    )

    return updateOrder
  }

  static async fetchOrderByParams(orderPayload: Partial<ISocketOrder & IPagination>) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload
    const { schedule } = restOfPayload

    if (schedule) {
      const order: Awaited<ISocketOrder[] | null> = await SocketOrder.find({
        ...restOfPayload,
      })
        .populate({
          path: "vendorId",
          select:
            "name email address businessNumber vendorType ratingAverage isAvailable image",
        })
        .populate({
          path: "assignedRider",
          select: "firstName lastName email image",
        })
        .populate({
          path: "vendorId",
          select: "firstName lastName email image",
        })
        .populate({ path: "itemId._id" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      return order
    }
    const order: Awaited<ISocketOrder[] | null> = await SocketOrder.find({
      ...restOfPayload,
    })
      .populate({
        path: "vendorId",
        select:
          "name email address businessNumber vendorType ratingAverage isAvailable image",
      })
      .populate({
        path: "assignedRider",
        select: "firstName lastName email image",
      })
      .populate({ path: "itemId._id" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async fetchOrderLocations(
    orderPayload: Partial<ISocketOrder & IPagination & ICoord & { _id?: string }>,
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload

    let { lat, lng, search, _id, ...extraParams } = restOfPayload
    if (!search) search = ""

    let latToString: any = lat?.toString()
    let lngToString: any = lng?.toString()

    let latString: string = latToString
    let lngString: string = lngToString
    const floatString = "16000"

    const order = await SocketOrder.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lngString), parseFloat(latString)],
          },
          key: "locationCoord",
          maxDistance: parseFloat(floatString),
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "vendor",
          localField: "vendorId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                locationCoord: 1,
                address: 1,
                phone: 1,
                image: 1,
              },
            },
          ],
          as: "vendorDetails",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "orderedBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "item",
          localField: "itemId._id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                description: 1,
                price: 1,
                image: 1,
              },
            },
          ],
          as: "itemDetails",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [{ deliveryAddress: { $regex: search, $options: "i" } }],
              paymentStatus: "paid",
              ...(_id ? { _id: new mongoose.Types.ObjectId(_id) } : {}),
              ...extraParams,
            },
          ],
        },
      },
    ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async riderOrderWithoutLocations(
    orderPayload: Partial<ISocketOrder & IPagination>,
  ) {
    const {
      limit = LIMIT,
      skip = SKIP,
      sort = SORT,
      ...restOfPayload
    } = orderPayload

    const order = await SocketOrder.aggregate([
      {
        $lookup: {
          from: "vendor",
          localField: "vendorId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                locationCoord: 1,
                address: 1,
                phone: 1,
                image: 1,
              },
            },
          ],
          as: "vendorDetails",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "orderedBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "item",
          localField: "itemId._id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                description: 1,
                price: 1,
                image: 1,
              },
            },
          ],
          as: "itemDetails",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          paymentStatus: "paid",
          ...restOfPayload,
        },
      },
    ])
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)

    return order
  }

  static async adminOrderChartAnalysis(payload: { duration: any }) {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const countsByMonth = await SocketOrder.aggregate([
      {
        $match: {
          orderStatus: "completed",
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: { $dateToString: { format: "%B", date: "$createdAt" } },
          year: { $year: "$createdAt" },
          count: 1,
        },
      },
    ])
    return countsByMonth
  }
}
