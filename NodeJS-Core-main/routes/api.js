require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { authenticated, optionalAuthenticated, role } = require("kernels/middlewares");
const { validate } = require("kernels/validations");

// ===== Controllers =====
const authController = require("modules/auth/controllers/authController");
const userController = require("modules/user/controllers/userController");
const categoryController = require("modules/category/controllers/categoryController");
const productController = require("modules/product/controllers/productController");
const occasionController = require("modules/occasion/controllers/occasionController");
const cartController = require("modules/cart/controllers/cartController");
const orderController = require("modules/order/controllers/orderController");
const couponController = require("modules/coupon/controllers/couponController");
const reviewController = require("modules/review/controllers/reviewController");
const wishlistController = require("modules/wishlist/controllers/wishlistController");
const notificationController = require("modules/notification/controllers/notificationController");
const paymentController = require("modules/payment/controllers/paymentController");

// ===== Validations =====
const authValidation = require("modules/auth/validations/authValidation");
const userValidation = require("modules/user/validations/userValidation");
const categoryValidation = require("modules/category/validations/categoryValidation");
const productValidation = require("modules/product/validations/productValidation");
const occasionValidation = require("modules/occasion/validations/occasionValidation");
const cartValidation = require("modules/cart/validations/cartValidation");
const orderValidation = require("modules/order/validations/orderValidation");
const couponValidation = require("modules/coupon/validations/couponValidation");
const reviewValidation = require("modules/review/validations/reviewValidation");

const router = express.Router({ mergeParams: true });

// =====================================================================
// AUTH ROUTES - /auth
// =====================================================================
router.group("/auth", (router) => {
  router.post("/register", validate([authValidation.register]), authController.register);
  router.post("/login", validate([authValidation.login]), authController.login);
  router.get("/me", middlewares([authenticated]), authController.me);
});

// =====================================================================
// USER ROUTES - /user (yêu cầu đăng nhập)
// =====================================================================
router.group("/user", middlewares([authenticated]), (router) => {
  router.put("/profile", userController.updateProfile);
  router.get("/addresses", userController.listAddresses);
  router.post("/addresses", validate([userValidation.addAddress]), userController.addAddress);
  router.delete("/addresses/:id", userController.deleteAddress);
});

// =====================================================================
// CATEGORY ROUTES - /categories
// =====================================================================
router.group("/categories", (router) => {
  router.get("/", categoryController.index);
  router.get("/:id", categoryController.show);
  router.post(
    "/",
    middlewares([authenticated, role("admin")]),
    validate([categoryValidation.create]),
    categoryController.create
  );
  router.put("/:id", middlewares([authenticated, role("admin")]), categoryController.update);
  router.delete("/:id", middlewares([authenticated, role("admin")]), categoryController.destroy);
});

// =====================================================================
// OCCASION ROUTES - /occasions
// =====================================================================
router.group("/occasions", (router) => {
  router.get("/", occasionController.index);
  router.get("/:id", occasionController.show);
  router.post(
    "/",
    middlewares([authenticated, role("admin")]),
    validate([occasionValidation.create]),
    occasionController.create
  );
  router.put("/:id", middlewares([authenticated, role("admin")]), occasionController.update);
  router.delete("/:id", middlewares([authenticated, role("admin")]), occasionController.destroy);
});

// =====================================================================
// PRODUCT ROUTES - /products
// =====================================================================
router.group("/products", (router) => {
  router.get("/", productController.index);
  router.get("/:id", productController.show);
  router.post(
    "/",
    middlewares([authenticated, role("admin", "staff")]),
    validate([productValidation.create]),
    productController.create
  );
  router.put("/:id", middlewares([authenticated, role("admin", "staff")]), productController.update);
  router.delete("/:id", middlewares([authenticated, role("admin")]), productController.destroy);

  // Reviews của từng sản phẩm
  router.get("/:productId/reviews", reviewController.listByProduct);
});

// =====================================================================
// REVIEW ROUTES - /reviews
// =====================================================================
router.group("/reviews", middlewares([authenticated]), (router) => {
  router.post("/", validate([reviewValidation.create]), reviewController.create);
  router.delete("/:id", reviewController.destroy);
});

// =====================================================================
// COUPON ROUTES - /coupons
// =====================================================================
router.group("/coupons", (router) => {
  // Public: Kiểm tra và tính toán coupon
  router.post("/apply", validate([couponValidation.apply]), couponController.apply);

  // Admin only: CRUD coupon
  router.get("/", middlewares([authenticated, role("admin")]), couponController.index);
  router.post(
    "/",
    middlewares([authenticated, role("admin")]),
    validate([couponValidation.create]),
    couponController.create
  );
  router.put("/:id", middlewares([authenticated, role("admin")]), couponController.update);
  router.delete("/:id", middlewares([authenticated, role("admin")]), couponController.destroy);
});

// =====================================================================
// CART ROUTES - /cart (tự động phân biệt Guest qua x-session-id & User qua JWT)
// =====================================================================
router.group("/cart", middlewares([optionalAuthenticated]), (router) => {
  router.get("/", cartController.index);
  router.post("/add", validate([cartValidation.addItem]), cartController.addItem);
  router.put("/items/:itemId", validate([cartValidation.updateItem]), cartController.updateItem);
  router.delete("/items/:itemId", cartController.removeItem);
});

// =====================================================================
// ORDER ROUTES - /orders (yêu cầu đăng nhập)
// =====================================================================
router.group("/orders", middlewares([authenticated]), (router) => {
  // Admin / Staff: Danh sách toàn bộ đơn hàng
  router.get("/", middlewares([role("admin", "staff")]), orderController.index);
  // User: Đặt hàng, Xem danh sách đơn hàng cá nhân, Xem chi tiết đơn
  router.post("/checkout", validate([orderValidation.checkout]), orderController.checkout);
  router.get("/my-orders", orderController.userOrders);
  router.get("/:id", orderController.show);
  // Admin / Staff: Cập nhật trạng thái đơn hàng
  router.put(
    "/:id/status",
    middlewares([role("admin", "staff")]),
    validate([orderValidation.updateStatus]),
    orderController.updateStatus
  );
});

// =====================================================================
// DELIVERY SLOTS ROUTES - /delivery-slots (dành cho checkout chọn khung giờ)
// =====================================================================
router.get("/delivery-slots", orderController.getDeliverySlots);

// =====================================================================
// WISHLIST ROUTES - /wishlist (yêu cầu đăng nhập)
// =====================================================================
router.group("/wishlist", middlewares([authenticated]), (router) => {
  router.get("/", wishlistController.index);
  router.post("/:productId", wishlistController.add);
  router.delete("/:productId", wishlistController.remove);
});

// =====================================================================
// NOTIFICATION ROUTES - /notifications (yêu cầu đăng nhập)
// =====================================================================
router.group("/notifications", middlewares([authenticated]), (router) => {
  router.get("/", notificationController.index);
  router.put("/read-all", notificationController.markAllAsRead);
  router.put("/:id/read", notificationController.markAsRead);
  router.delete("/:id", notificationController.destroy);
});

// =====================================================================
// PAYMENT ROUTES - /payments
// =====================================================================
router.group("/payments", (router) => {
  // Webhook từ provider (SePay, Casso...) - Public endpoint (sử dụng API Key validation bên trong)
  router.post("/webhook", paymentController.webhook);
  
  // Endpoint để frontend poll trạng thái thanh toán
  router.get("/status/:orderNumber", middlewares([authenticated]), paymentController.status);
});

module.exports = router;

