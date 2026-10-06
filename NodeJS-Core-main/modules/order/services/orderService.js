const { Order, OrderItem, OrderStatusHistory, Cart, CartItem, Product, ProductTranslation, ProductVariant, Coupon, User, DeliveryTimeSlot, sequelize } = require("models");
const notificationService = require("modules/notification/services/notificationService");
const paymentService = require("modules/payment/services/paymentService");

const orderService = {
  checkout: async (userId, data) => {
    const transaction = await sequelize.transaction();

    try {
      const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                include: [{ model: ProductTranslation, as: "translations" }],
              },
              { model: ProductVariant, as: "variant" },
            ],
          },
        ],
        transaction,
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        const error = new Error("Cart is empty");
        error.statusCode = 400;
        throw error;
      }

      let subtotal = 0;
      const orderItemsData = [];

      for (let item of cart.items) {
        const product = item.product;
        if (!product || !product.is_active) {
          const error = new Error(`Product ${item.product_id} is no longer available`);
          error.statusCode = 400;
          throw error;
        }

        let unitPrice = parseFloat(product.base_price);
        if (item.variant) {
          unitPrice += parseFloat(item.variant.price_modifier || 0);
        }

        const itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;

        const translation =
          product.translations && product.translations.length > 0
            ? product.translations[0].name
            : product.sku;

        orderItemsData.push({
          product_id: product.id,
          variant_id: item.variant_id || null,
          product_name_snapshot: translation,
          quantity: item.quantity,
          unit_price: unitPrice,
          subtotal: itemSubtotal,
        });
      }

      // Áp dụng coupon nếu có
      let discount_amount = parseFloat(data.discount_amount || 0);
      let coupon_id = null;

      if (data.coupon_code) {
        const coupon = await Coupon.findOne({
          where: { code: data.coupon_code, is_active: true },
          transaction,
        });

        if (coupon) {
          coupon_id = coupon.id;
          if (coupon.discount_type === "percentage") {
            discount_amount = (subtotal * parseFloat(coupon.discount_value)) / 100;
            if (coupon.max_discount_amount) {
              discount_amount = Math.min(discount_amount, parseFloat(coupon.max_discount_amount));
            }
          } else {
            discount_amount = parseFloat(coupon.discount_value);
          }

          // Tăng used_count
          await coupon.update({ used_count: coupon.used_count + 1 }, { transaction });
        }
      }

      const shipping_fee = parseFloat(data.shipping_fee || 0);
      const total_amount = Math.max(0, subtotal + shipping_fee - discount_amount);

      const orderNumber = `FLW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderTtl = parseInt(process.env.ORDER_TTL_MINUTES || "15");
      const expiresAt = new Date(Date.now() + orderTtl * 60 * 1000);

      const order = await Order.create(
        {
          order_number: orderNumber,
          user_id: userId,
          coupon_id,
          status: "pending",
          payment_status: "unpaid",
          subtotal,
          discount_amount,
          shipping_fee,
          total_amount,
          currency: "VND",
          delivery_type: data.delivery_type || "standard",
          scheduled_delivery_at: data.scheduled_delivery_at || null,
          recipient_name: data.recipient_name,
          recipient_phone: data.recipient_phone,
          delivery_address: data.delivery_address,
          card_message: data.card_message || null,
          notes: data.notes || null,
          expires_at: expiresAt,
        },
        { transaction }
      );

      for (let itemData of orderItemsData) {
        await OrderItem.create({ order_id: order.id, ...itemData }, { transaction });
      }

      // Ghi lịch sử trạng thái đầu tiên
      await OrderStatusHistory.create(
        {
          order_id: order.id,
          status: "pending",
          changed_by: userId,
          note: "Order placed",
        },
        { transaction }
      );

      // Xóa giỏ hàng
      await CartItem.destroy({ where: { cart_id: cart.id }, transaction });

      await transaction.commit();

      // Gửi thông báo (bên ngoài transaction)
      try {
        await notificationService.create(
          userId,
          "order_update",
          "Đặt hàng thành công",
          `Đơn hàng #${orderNumber} đã được đặt thành công. Tổng tiền: ${total_amount.toLocaleString()} VND`
        );
      } catch (_) {
        // Không throw nếu notification lỗi
      }

      const createdOrder = await orderService.getOrderById(order.id);
      let responseData = createdOrder.toJSON();

      if (data.payment_method === "bank_transfer") {
        responseData.qrUrl = paymentService.buildVietQrUrl(orderNumber, total_amount);
      }

      return responseData;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  listUserOrders: async (userId, query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };
    if (query.status) whereClause.status = query.status;

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [{ model: OrderItem, as: "items" }],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orders: rows,
    };
  },

  listAllOrders: async (query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (query.status) whereClause.status = query.status;

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: OrderItem, as: "items" },
        { model: User, as: "user", attributes: ["id", "full_name", "email", "phone"] },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orders: rows,
    };
  },

  getDeliverySlots: async (query = {}) => {
    const whereClause = {};
    if (query.date) {
      whereClause.delivery_date = query.date;
    }
    return await DeliveryTimeSlot.findAll({
      where: whereClause,
      order: [["delivery_date", "ASC"], ["slot_start", "ASC"]],
    });
  },

  getOrderById: async (orderId, userId = null) => {
    const whereClause = { id: orderId };
    if (userId) whereClause.user_id = userId;

    return await Order.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
        { model: OrderStatusHistory, as: "statusHistory" },
      ],
    });
  },

  updateStatus: async (orderId, status, changedById, note = null) => {
    const order = await Order.findByPk(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Ghi lịch sử trạng thái
    await OrderStatusHistory.create({
      order_id: orderId,
      status,
      changed_by: changedById,
      note: note || `Status changed from ${previousStatus} to ${status}`,
    });

    // Thông báo cho user
    try {
      const statusMessages = {
        confirmed: "Đơn hàng của bạn đã được xác nhận",
        processing: "Đơn hàng đang được chuẩn bị",
        ready_for_delivery: "Đơn hàng sẵn sàng giao",
        out_for_delivery: "Đơn hàng đang được giao đến bạn",
        delivered: "Đơn hàng đã được giao thành công",
        cancelled: "Đơn hàng của bạn đã bị hủy",
        refunded: "Đơn hàng đã được hoàn tiền",
      };

      if (statusMessages[status]) {
        await notificationService.create(
          order.user_id,
          "order_update",
          `Cập nhật đơn hàng #${order.order_number}`,
          statusMessages[status]
        );
      }
    } catch (_) {}

    return orderService.getOrderById(orderId);
  },
};

module.exports = orderService;


