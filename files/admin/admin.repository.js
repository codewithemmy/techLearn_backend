const { Admin } = require("../admin/admin.model");

class AdminRepository {
  static async create(body) {
    return Admin.create(body);
  }

  static async fetchAdmin(body) {
    const admin = await Admin.findOne({ ...body });
    return admin;
  }

  static async findAdminParams(adminPayload) {
    const { limit, skip, sort, ...restOfPayload } = adminPayload;
    const user = await Admin.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return user;
  }

  static async updateAdminDetails(query, params) {
    return Admin.findOneAndUpdate({ ...query }, { ...params });
  }
}

module.exports = { AdminRepository };
