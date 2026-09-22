const { User, UserAddress } = require("models");

const userService = {
  updateProfile: async (userId, data) => {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (data.full_name) user.full_name = data.full_name;
    if (data.phone) user.phone = data.phone;
    if (data.preferred_language) user.preferred_language = data.preferred_language;

    await user.save();

    const userObj = user.toJSON();
    delete userObj.password_hash;
    return userObj;
  },

  listAddresses: async (userId) => {
    return await UserAddress.findAll({ where: { user_id: userId } });
  },

  addAddress: async (userId, data) => {
    if (data.is_default) {
      await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
    }

    const address = await UserAddress.create({
      user_id: userId,
      address_type: data.address_type || "shipping",
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      address_line: data.address_line,
      ward: data.ward || "",
      district: data.district,
      city: data.city,
      is_default: data.is_default || false,
    });

    return address;
  },

  deleteAddress: async (userId, addressId) => {
    const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      throw error;
    }
    await address.destroy();
    return true;
  },
};

module.exports = userService;
