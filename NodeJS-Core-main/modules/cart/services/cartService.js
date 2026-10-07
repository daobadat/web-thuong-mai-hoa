const { Cart, CartItem, Product, ProductTranslation, ProductVariant, ProductImage } = require("models");

const cartService = {
  getOrCreateCart: async (userId, sessionId = null) => {
    let cart = null;
    let guestCart = null;

    if (sessionId) {
      guestCart = await Cart.findOne({ where: { session_id: sessionId, user_id: null } });
    }

    if (userId) {
      cart = await Cart.findOne({ where: { user_id: userId } });
      
      if (cart && guestCart) {
        // Merge guest items into user cart
        const guestItems = await CartItem.findAll({ where: { cart_id: guestCart.id } });
        for (let item of guestItems) {
          let existingItem = await CartItem.findOne({ 
            where: { cart_id: cart.id, product_id: item.product_id, variant_id: item.variant_id } 
          });
          if (existingItem) {
            existingItem.quantity += item.quantity;
            await existingItem.save();
            await item.destroy();
          } else {
            item.cart_id = cart.id;
            await item.save();
          }
        }
        await guestCart.destroy();
      } else if (!cart && guestCart) {
        // Assign guest cart to user
        guestCart.user_id = userId;
        await guestCart.save();
        cart = guestCart;
      }
    } else if (sessionId) {
      cart = guestCart;
    }

    if (!cart) {
      cart = await Cart.create({
        user_id: userId || null,
        session_id: sessionId || null,
      });
    }

    return cart;
  },

  getCart: async (userId, sessionId = null, lang = "vi") => {
    const cart = await cartService.getOrCreateCart(userId, sessionId);

    const fullCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: ProductTranslation,
                  as: "translations",
                  where: { language_code: lang },
                  required: false,
                },
                {
                  model: ProductImage,
                  as: "images",
                  where: { is_primary: true },
                  required: false,
                },
              ],
            },
            {
              model: ProductVariant,
              as: "variant",
              required: false,
            },
          ],
        },
      ],
    });

    return fullCart;
  },

  addItem: async (userId, { product_id, variant_id, quantity }, sessionId = null) => {
    const cart = await cartService.getOrCreateCart(userId, sessionId);

    const product = await Product.findByPk(product_id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    let existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
        variant_id: variant_id || null,
      },
    });

    let priceSnapshot = product.base_price;
    if (variant_id) {
      const variant = await ProductVariant.findByPk(variant_id);
      if (variant) {
        priceSnapshot = parseFloat(product.base_price) + parseFloat(variant.price_modifier);
      }
    }

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
      existingItem.unit_price_snapshot = priceSnapshot;
      await existingItem.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id,
        variant_id: variant_id || null,
        quantity: parseInt(quantity),
        unit_price_snapshot: priceSnapshot,
      });
    }

    return cartService.getCart(userId, sessionId);
  },

  updateItem: async (userId, itemId, quantity, sessionId = null) => {
    const cart = await cartService.getOrCreateCart(userId, sessionId);

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!item) {
      const error = new Error("Cart item not found");
      error.statusCode = 404;
      throw error;
    }

    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = parseInt(quantity);
      await item.save();
    }

    return cartService.getCart(userId, sessionId);
  },

  removeItem: async (userId, itemId, sessionId = null) => {
    const cart = await cartService.getOrCreateCart(userId, sessionId);

    const item = await CartItem.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!item) {
      const error = new Error("Cart item not found");
      error.statusCode = 404;
      throw error;
    }

    await item.destroy();
    return cartService.getCart(userId, sessionId);
  },
};

module.exports = cartService;
