-- =====================================================================
-- Flower Shop E-commerce - MySQL 8.0 Schema (fixed from DBML export)
-- =====================================================================

-- Xoa sach database cu neu co, tranh warning 1007 va dam bao chay lai idempotent.
-- Luu y: DROP toan bo DB se mat het du lieu hien co - chi dung cho moi truong dev/test.
DROP DATABASE IF EXISTS `flower_shop`;
CREATE DATABASE `flower_shop`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `flower_shop`;

SET FOREIGN_KEY_CHECKS = 0;

-- Idempotent re-run (drop theo thứ tự ngược dependency)
DROP TABLE IF EXISTS `product_embeddings`;
DROP TABLE IF EXISTS `ai_recommendation_logs`;
DROP TABLE IF EXISTS `chatbot_messages`;
DROP TABLE IF EXISTS `chatbot_conversations`;
DROP TABLE IF EXISTS `admin_audit_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `wishlists`;
DROP TABLE IF EXISTS `product_reviews`;
DROP TABLE IF EXISTS `shipments`;
DROP TABLE IF EXISTS `delivery_time_slots`;
DROP TABLE IF EXISTS `payment_transactions`;
DROP TABLE IF EXISTS `order_status_history`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `product_occasions`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `product_translations`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `occasion_translations`;
DROP TABLE IF EXISTS `occasions`;
DROP TABLE IF EXISTS `category_translations`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `refresh_tokens`;
DROP TABLE IF EXISTS `user_oauth_accounts`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `languages`;

-- =====================================================================
-- CREATE TABLES
-- =====================================================================

CREATE TABLE `languages` (
  `code` varchar(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`code`)
);

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(20),
  `password_hash` varchar(255),
  `full_name` varchar(150) NOT NULL,
  `role` ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer',
  `preferred_language` varchar(5) NOT NULL DEFAULT 'vi',
  `is_active` boolean NOT NULL DEFAULT true,
  `email_verified_at` datetime NULL,
  `last_login_at` datetime NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT = 'Core identity table. Password auth or OAuth (see user_oauth_accounts) - password_hash nullable for social-only accounts.';

CREATE TABLE `user_oauth_accounts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `provider` ENUM('google','facebook') NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT = 'Google/Facebook - Kakao/Naver có thể phù hợp hơn cho user Hàn Quốc.';

CREATE TABLE `refresh_tokens` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `token_hash` varchar(255) UNIQUE NOT NULL COMMENT 'SHA-256 hash only, never the raw JWT',
  `device_info` varchar(255),
  `ip_address` varchar(45),
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `user_addresses` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `address_type` ENUM('shipping','billing') NOT NULL DEFAULT 'shipping',
  `recipient_name` varchar(150) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `ward` varchar(100),
  `district` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `is_default` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `parent_id` char(36),
  `slug` varchar(150) UNIQUE NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `display_order` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `category_translations` (
  `category_id` char(36) NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`, `language_code`)
);

CREATE TABLE `occasions` (
  `id` char(36) NOT NULL,
  `slug` varchar(150) UNIQUE NOT NULL COMMENT 'e.g. chuseok, white-day, grand-opening',
  `fixed_date` date COMMENT 'NULL if not calendar-fixed, e.g. birthday',
  `is_recurring` boolean NOT NULL DEFAULT true,
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `occasion_translations` (
  `occasion_id` char(36) NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  PRIMARY KEY (`occasion_id`, `language_code`)
);

CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `sku` varchar(50) UNIQUE NOT NULL,
  `category_id` char(36) NOT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'VND',
  `stock_quantity` int NOT NULL DEFAULT 0,
  `is_preorder` boolean NOT NULL DEFAULT false,
  `is_active` boolean NOT NULL DEFAULT true,
  `avg_rating` decimal(3,2) NOT NULL DEFAULT 0,
  `review_count` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `product_translations` (
  `product_id` char(36) NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `care_instructions` text,
  PRIMARY KEY (`product_id`, `language_code`)
);

CREATE TABLE `product_images` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `url` varchar(500) NOT NULL,
  `is_primary` boolean NOT NULL DEFAULT false,
  `display_order` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE `product_variants` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `sku` varchar(60) UNIQUE NOT NULL,
  `variant_name` varchar(100) NOT NULL COMMENT 'e.g. Bo nho / SO_HYUNG, Bo lon / DAE_HYUNG',
  `price_modifier` decimal(12,2) NOT NULL DEFAULT 0,
  `stock_quantity` int NOT NULL DEFAULT 0,
  `is_active` boolean NOT NULL DEFAULT true,
  PRIMARY KEY (`id`)
);

CREATE TABLE `product_occasions` (
  `product_id` char(36) NOT NULL,
  `occasion_id` char(36) NOT NULL,
  PRIMARY KEY (`product_id`, `occasion_id`)
);

CREATE TABLE `carts` (
  `id` char(36) NOT NULL,
  `user_id` char(36),
  `session_id` varchar(100),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT = 'Guest carts keyed by session_id, merged into the user cart on login.';

CREATE TABLE `cart_items` (
  `id` char(36) NOT NULL,
  `cart_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `variant_id` char(36),
  `quantity` int NOT NULL,
  `unit_price_snapshot` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `coupons` (
  `id` char(36) NOT NULL,
  `code` varchar(50) UNIQUE NOT NULL,
  `discount_type` ENUM('percentage','fixed_amount') NOT NULL,
  `discount_value` decimal(12,2) NOT NULL,
  `min_order_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `max_discount_amount` decimal(12,2),
  `usage_limit` int,
  `used_count` int NOT NULL DEFAULT 0,
  `valid_from` datetime NOT NULL,
  `valid_to` datetime NOT NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `order_number` varchar(30) UNIQUE NOT NULL,
  `user_id` char(36) NOT NULL,
  `coupon_id` char(36),
  `status` ENUM('pending','confirmed','processing','ready_for_delivery','out_for_delivery','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('unpaid','pending','paid','failed','refunded','partially_refunded') NOT NULL DEFAULT 'unpaid',
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `shipping_fee` decimal(12,2) NOT NULL DEFAULT 0,
  `total_amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'VND',
  `delivery_type` ENUM('standard','scheduled') NOT NULL DEFAULT 'standard',
  `scheduled_delivery_at` datetime NULL,
  `recipient_name` varchar(150) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `card_message` text,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) COMMENT = 'recipient_* fields tach rieng khoi user_id - nguoi mua va nguoi nhan thuong khac nhau trong flower gifting.';

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `variant_id` char(36),
  `product_name_snapshot` varchar(255) NOT NULL COMMENT 'denormalized, survives product edits/deletion',
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_status_history` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `status` ENUM('pending','confirmed','processing','ready_for_delivery','out_for_delivery','delivered','cancelled','refunded') NOT NULL,
  `changed_by` char(36),
  `note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `payment_transactions` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `payment_method` ENUM('vnpay','momo','zalopay','stripe','bank_transfer','cod') NOT NULL,
  `provider_transaction_id` varchar(150),
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'VND',
  `status` ENUM('initiated','pending','success','failed','refunded') NOT NULL DEFAULT 'initiated',
  `raw_response` json COMMENT 'full gateway callback payload, for reconciliation',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `delivery_time_slots` (
  `id` char(36) NOT NULL,
  `delivery_date` date NOT NULL,
  `slot_start` time NOT NULL,
  `slot_end` time NOT NULL,
  `max_capacity` int NOT NULL DEFAULT 20,
  `current_bookings` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) COMMENT = 'Caps deliveries per slot - needed for peak-occasion demand (Valentine, Chuseok).';

CREATE TABLE `shipments` (
  `id` char(36) NOT NULL,
  `order_id` char(36) UNIQUE NOT NULL,
  `time_slot_id` char(36),
  `courier` varchar(100),
  `tracking_number` varchar(100),
  `status` ENUM('pending','assigned','picked_up','in_transit','delivered','failed') NOT NULL DEFAULT 'pending',
  `delivered_at` datetime NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `product_reviews` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `order_item_id` char(36),
  `rating` tinyint NOT NULL COMMENT '1 to 5',
  `comment` text,
  `is_verified_purchase` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_product_reviews_rating` CHECK (`rating` BETWEEN 1 AND 5)
);

CREATE TABLE `wishlists` (
  `user_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `product_id`)
);

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `type` ENUM('order_update','promotion','system','chatbot') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `admin_audit_logs` (
  `id` char(36) NOT NULL,
  `admin_id` char(36) NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36),
  `old_value` json,
  `new_value` json,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `chatbot_conversations` (
  `id` char(36) NOT NULL,
  `user_id` char(36),
  `session_id` varchar(100),
  `language` varchar(5) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `chatbot_messages` (
  `id` char(36) NOT NULL,
  `conversation_id` char(36) NOT NULL,
  `role` ENUM('user','assistant','system') NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `ai_recommendation_logs` (
  `id` char(36) NOT NULL,
  `user_id` char(36),
  `occasion_id` char(36),
  `budget_min` decimal(12,2),
  `budget_max` decimal(12,2),
  `recommended_product_ids` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- MySQL (<9.x GA) khong co kieu VECTOR native. Luu embedding duoi dang JSON
-- array de tuong thich Workbench; can tinh cosine similarity o application
-- layer hoac day sang vector store rieng (pgvector/Milvus/Qdrant/Pinecone)
-- khi scale. Neu dung MySQL HeatWave / 9.x, doi lai thanh `VECTOR(1536)`.
CREATE TABLE `product_embeddings` (
  `product_id` char(36) NOT NULL,
  `embedding` json NOT NULL COMMENT 'array 1536 float, dimension phai khop embedding model (vd text-embedding-3-small)',
  `model_version` varchar(50) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) COMMENT = 'Cosine-similarity vector cho AI flower recommendation theo occasion/budget.';

-- =====================================================================
-- INDEXES
-- =====================================================================

CREATE UNIQUE INDEX `user_oauth_accounts_index_0` ON `user_oauth_accounts` (`provider`, `provider_user_id`);
CREATE UNIQUE INDEX `cart_items_index_1` ON `cart_items` (`cart_id`, `product_id`, `variant_id`);
CREATE UNIQUE INDEX `delivery_time_slots_index_2` ON `delivery_time_slots` (`delivery_date`, `slot_start`, `slot_end`);
CREATE UNIQUE INDEX `product_reviews_index_3` ON `product_reviews` (`user_id`, `order_item_id`);

-- Index bo sung cho cac cot truy van/join thuong xuyen nhung khong tu dong
-- co index qua FOREIGN KEY (FK tren cung mot cot da tu tao index roi)
CREATE INDEX `idx_products_active_category` ON `products` (`category_id`, `is_active`);
CREATE INDEX `idx_orders_user_status` ON `orders` (`user_id`, `status`);
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);
CREATE INDEX `idx_chatbot_messages_conv_created` ON `chatbot_messages` (`conversation_id`, `created_at`);

-- =====================================================================
-- FOREIGN KEYS
-- =====================================================================

ALTER TABLE `users` ADD FOREIGN KEY (`preferred_language`) REFERENCES `languages` (`code`);

ALTER TABLE `user_oauth_accounts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `refresh_tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `categories` ADD FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`);

ALTER TABLE `category_translations` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `category_translations` ADD FOREIGN KEY (`language_code`) REFERENCES `languages` (`code`);

ALTER TABLE `occasion_translations` ADD FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`);
ALTER TABLE `occasion_translations` ADD FOREIGN KEY (`language_code`) REFERENCES `languages` (`code`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `product_translations` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `product_translations` ADD FOREIGN KEY (`language_code`) REFERENCES `languages` (`code`);

ALTER TABLE `product_images` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `product_variants` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `product_occasions` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `product_occasions` ADD FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`);

ALTER TABLE `carts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `cart_items` ADD FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);

ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

ALTER TABLE `order_status_history` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `order_status_history` ADD FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`);

ALTER TABLE `payment_transactions` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

-- FIX: ban goc co FK nguoc `orders.id -> shipments.order_id`, gay chicken-egg
-- khi insert order (order phai co shipment truoc). FK dung phai nam o
-- shipments (bang con) tro ve orders (bang cha).
ALTER TABLE `shipments` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `shipments` ADD FOREIGN KEY (`time_slot_id`) REFERENCES `delivery_time_slots` (`id`);

ALTER TABLE `product_reviews` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `product_reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `product_reviews` ADD FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);

ALTER TABLE `wishlists` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `wishlists` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `admin_audit_logs` ADD FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

ALTER TABLE `chatbot_conversations` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `chatbot_conversations` ADD FOREIGN KEY (`language`) REFERENCES `languages` (`code`);

ALTER TABLE `chatbot_messages` ADD FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`);

ALTER TABLE `ai_recommendation_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `ai_recommendation_logs` ADD FOREIGN KEY (`occasion_id`) REFERENCES `occasions` (`id`);

-- FIX: tuong tu shipments - FK phai nam o product_embeddings (bang con,
-- shared PK) tro ve products, khong phai chieu nguoc lai.
ALTER TABLE `product_embeddings` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

-- =====================================================================
-- TRIGGERS: tu sinh UUID cho id khi ung dung khong truyen (hoac truyen NULL)
-- Thay the cho `DEFAULT (UUID())` de tuong thich moi ban MySQL 5.7+/8.x/MariaDB.
-- Neu backend da tu generate UUID (khuyen nghi cho microservice/clean arch),
-- cac trigger nay chi la fallback, khong anh huong gi.
-- =====================================================================

DELIMITER $$

CREATE TRIGGER `trg_users_bi` BEFORE INSERT ON `users` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_user_oauth_accounts_bi` BEFORE INSERT ON `user_oauth_accounts` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_refresh_tokens_bi` BEFORE INSERT ON `refresh_tokens` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_user_addresses_bi` BEFORE INSERT ON `user_addresses` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_categories_bi` BEFORE INSERT ON `categories` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_occasions_bi` BEFORE INSERT ON `occasions` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_products_bi` BEFORE INSERT ON `products` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_product_images_bi` BEFORE INSERT ON `product_images` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_product_variants_bi` BEFORE INSERT ON `product_variants` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_carts_bi` BEFORE INSERT ON `carts` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_cart_items_bi` BEFORE INSERT ON `cart_items` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_coupons_bi` BEFORE INSERT ON `coupons` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_orders_bi` BEFORE INSERT ON `orders` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_order_items_bi` BEFORE INSERT ON `order_items` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_order_status_history_bi` BEFORE INSERT ON `order_status_history` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_payment_transactions_bi` BEFORE INSERT ON `payment_transactions` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_delivery_time_slots_bi` BEFORE INSERT ON `delivery_time_slots` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_shipments_bi` BEFORE INSERT ON `shipments` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_product_reviews_bi` BEFORE INSERT ON `product_reviews` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_notifications_bi` BEFORE INSERT ON `notifications` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_admin_audit_logs_bi` BEFORE INSERT ON `admin_audit_logs` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_chatbot_conversations_bi` BEFORE INSERT ON `chatbot_conversations` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_chatbot_messages_bi` BEFORE INSERT ON `chatbot_messages` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

CREATE TRIGGER `trg_ai_recommendation_logs_bi` BEFORE INSERT ON `ai_recommendation_logs` FOR EACH ROW
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF;
END$$

DELIMITER ;

SET FOREIGN_KEY_CHECKS = 1;qqq