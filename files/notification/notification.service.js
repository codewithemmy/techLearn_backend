const mongoose = require("mongoose")
const { NotificationRepository } = require("./notification.repository")
const { queryConstructor } = require("../../utils/index")
const { notificationMessages } = require("./notification.messages")

class NotificationService {
  static async create(payload) {
    return NotificationRepository.createNotification(payload)
  }

  static async fetchNotifications(query) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Notification"
    )

    if (error) return { success: false, msg: error }

    const notifications =
      await NotificationRepository.fetchNotificationsByParams({
        ...params,
        limit,
        skip,
        sort,
      })

    if (!notifications)
      return {
        success: true,
        msg: notificationMessages.NOTIFICATION_NOT_FOUND,
        data: [],
      }

    return {
      success: true,
      msg: notificationMessages.NOTIFICATION_FETCHED,
      data: notifications,
    }
  }
}

module.exports = { NotificationService }
