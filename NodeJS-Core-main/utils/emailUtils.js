"use strict";

const nodemailer = require("nodemailer");
const logger = require("./logger");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    logger.warn("[email] Chưa cấu hình SMTP_USER hoặc SMTP_PASSWORD trong .env. Email sẽ được ghi log vào console.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  return transporter;
}

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(Number(amount) || 0)) + "đ";
}

function renderCustomerOrderHtml(order) {
  const items = order.items || [];
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f0e6dc; font-size: 14px; color: #2b2a26;">
          <strong>${item.product?.name || item.product_name || "Sản phẩm hoa"}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f0e6dc; text-align: center; font-size: 14px; color: #555;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f0e6dc; text-align: right; font-size: 14px; color: #2b2a26; font-weight: 600;">
          ${formatVND(item.unit_price || item.total_price)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác nhận đơn hàng ${order.order_number}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf6f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b2a26;">
  <div style="max-width: 620px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eee5dc;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6E2A34 0%, #4A1A22 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">🌸 Hoa Tươi KFlowerVN</h1>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">Cảm ơn bạn đã đặt hoa! Đơn hàng của bạn đã được ghi nhận.</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 24px;">
      
      <!-- Order Banner -->
      <div style="background-color: #f8f3ed; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; border-left: 4px solid #6E2A34;">
        <div style="font-size: 13px; color: #7a7163; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Mã đơn hàng</div>
        <div style="font-size: 20px; font-weight: 700; color: #6E2A34; margin-top: 4px;">#${order.order_number}</div>
      </div>

      <!-- Recipient Info -->
      <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #2b2a26; border-bottom: 2px solid #f0e6dc; padding-bottom: 8px;">
        📦 Thông tin nhận hoa
      </h3>
      <table style="width: 100%; margin-bottom: 24px; font-size: 14px; line-height: 1.6;">
        <tr>
          <td style="width: 140px; color: #7a7163; padding: 4px 0;">Người nhận:</td>
          <td style="font-weight: 600; color: #2b2a26;">${order.recipient_name || "—"}</td>
        </tr>
        <tr>
          <td style="color: #7a7163; padding: 4px 0;">Số điện thoại:</td>
          <td style="color: #2b2a26;">${order.recipient_phone || "—"}</td>
        </tr>
        <tr>
          <td style="color: #7a7163; padding: 4px 0;">Địa chỉ giao:</td>
          <td style="color: #2b2a26;">${order.delivery_address || "—"}</td>
        </tr>
        <tr>
          <td style="color: #7a7163; padding: 4px 0;">Ngày & Khung giờ:</td>
          <td style="color: #2b2a26; font-weight: 600;">${order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("vi-VN") : "Giao sớm nhất"} (${order.delivery_time || "08:00 - 12:00"})</td>
        </tr>
        ${
          order.card_message
            ? `
        <tr>
          <td style="color: #7a7163; padding: 4px 0; vertical-align: top;">Lời nhắn trên thiệp:</td>
          <td style="color: #6E2A34; font-style: italic; background-color: #fff9f5; padding: 6px 10px; border-radius: 6px;">"${order.card_message}"</td>
        </tr>
        `
            : ""
        }
      </table>

      <!-- Items Table -->
      <h3 style="margin: 0 0 14px 0; font-size: 16px; color: #2b2a26; border-bottom: 2px solid #f0e6dc; padding-bottom: 8px;">
        💐 Danh sách sản phẩm
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f3ed;">
            <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #7a7163; text-transform: uppercase;">Sản phẩm</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #7a7163; text-transform: uppercase;">SL</th>
            <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #7a7163; text-transform: uppercase;">Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center;">Chi tiết sản phẩm hoa</td></tr>'}
        </tbody>
      </table>

      <!-- Total Summary -->
      <div style="background-color: #fdfbf7; border: 1px dashed #e4d9c8; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; color: #666;">
          <span>Tạm tính:</span>
          <span>${formatVND(order.subtotal || order.total_amount)}</span>
        </div>
        ${
          Number(order.shipping_fee) > 0
            ? `
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; color: #666;">
          <span>Phí giao hàng:</span>
          <span>${formatVND(order.shipping_fee)}</span>
        </div>
        `
            : ""
        }
        ${
          Number(order.discount_amount) > 0
            ? `
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; color: #2e7d32;">
          <span>Giảm giá:</span>
          <span>-${formatVND(order.discount_amount)}</span>
        </div>
        `
            : ""
        }
        <div style="border-top: 1px solid #e4d9c8; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 17px; font-weight: 700; color: #6E2A34;">
          <span>Tổng thanh toán:</span>
          <span>${formatVND(order.total_amount)}</span>
        </div>
        <div style="font-size: 13px; color: #7a7163; margin-top: 6px; text-align: right;">
          Phương thức: <strong>${order.payment_method === "bank_transfer" ? "Chuyển khoản ngân hàng (QR)" : order.payment_method === "cod" ? "Thanh toán khi nhận hàng (COD)" : order.payment_method}</strong>
        </div>
      </div>

      <!-- Support note -->
      <div style="text-align: center; font-size: 13px; color: #7a7163; line-height: 1.6;">
        Nếu bạn có bất kỳ thay đổi nào về thời gian hoặc địa chỉ giao hoa, vui lòng liên hệ ngay với chúng tôi qua Hotline hoặc Zalo.
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f4ede3; padding: 20px 24px; text-align: center; font-size: 12px; color: #7a7163; border-top: 1px solid #eee5dc;">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #2b2a26;">KFlowerVN — Hoa Tươi Giao Trong Ngày</p>
      <p style="margin: 0 0 6px 0;">🌐 Website: <a href="https://kflowervn.site" style="color: #6E2A34; text-decoration: none; font-weight: 600;">kflowervn.site</a> | 📞 Hotline: 0901 234 567</p>
      <p style="margin: 0; opacity: 0.8;">© 2026 KFlowerVN. Mọi quyền được bảo lưu.</p>
    </div>

  </div>
</body>
</html>
  `;
}

function renderAdminAlertHtml(order) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>ĐƠN HÀNG MỚI #${order.order_number}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 2px solid #6E2A34; overflow: hidden;">
    <div style="background-color: #6E2A34; color: #ffffff; padding: 18px 20px;">
      <h2 style="margin: 0; font-size: 18px;">🔔 CÓ ĐƠN ĐẶT HOA MỚI!</h2>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Đơn hàng #${order.order_number} vừa được tạo.</p>
    </div>
    <div style="padding: 20px; font-size: 14px; line-height: 1.6; color: #333;">
      <p style="margin: 0 0 10px 0;"><strong>💰 Tổng tiền:</strong> <span style="color: #6E2A34; font-size: 18px; font-weight: bold;">${formatVND(order.total_amount)}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>👤 Người nhận:</strong> ${order.recipient_name} (${order.recipient_phone})</p>
      <p style="margin: 0 0 6px 0;"><strong>📍 Địa chỉ:</strong> ${order.delivery_address}</p>
      <p style="margin: 0 0 6px 0;"><strong>🕒 Thời gian giao:</strong> ${order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("vi-VN") : "Hôm nay"} - ${order.delivery_time || "08:00 - 12:00"}</p>
      <p style="margin: 0 0 6px 0;"><strong>💳 Phương thức TT:</strong> ${order.payment_method} (${order.payment_status || "Chưa thanh toán"})</p>
      ${order.card_message ? `<p style="margin: 0 0 6px 0; background: #fff5eb; padding: 8px; border-radius: 6px;"><strong>💌 Lời nhắn thiệp:</strong> <em>"${order.card_message}"</em></p>` : ""}
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://kflowervn.site/admin/orders" style="display: inline-block; background-color: #6E2A34; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Xem Đơn Hàng Trong Admin →</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function renderPaymentSuccessHtml(order) {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác nhận thanh toán đơn hàng ${order.order_number}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; overflow: hidden;">
    <div style="background-color: #2e7d32; color: #ffffff; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 20px;">✅ THANH TOÁN THÀNH CÔNG!</h2>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Chúng tôi đã nhận được thanh toán cho đơn hàng #${order.order_number}</p>
    </div>
    <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #333;">
      <p style="font-size: 15px;">Xin chào <strong>${order.recipient_name || "Quý khách"}</strong>,</p>
      <p>KFlowerVN xác nhận đã nhận được số tiền <strong>${formatVND(order.total_amount)}</strong> cho đơn hàng <strong>#${order.order_number}</strong>.</p>
      <p>Đơn hàng của bạn đã chuyển sang trạng thái <strong>Đã thanh toán</strong> và đang được các nghệ nhân cắm hoa chuẩn bị.</p>
      <div style="background-color: #f9f9f9; padding: 14px; border-radius: 8px; margin: 16px 0;">
        <div>📦 <strong>Giao tới:</strong> ${order.delivery_address}</div>
        <div style="margin-top: 4px;">⏰ <strong>Thời gian:</strong> ${order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("vi-VN") : "Hôm nay"} (${order.delivery_time || "08:00 - 12:00"})</div>
      </div>
      <p style="text-align: center; margin-top: 24px; color: #777; font-size: 13px;">Cảm ơn bạn đã tin tưởng dịch vụ hoa tươi của KFlowerVN!</p>
    </div>
  </div>
</body>
</html>
  `;
}

const emailUtils = {
  sendEmail: async ({ to, subject, html, text }) => {
    const sender = process.env.EMAIL_FROM || '"Hoa Tươi KFlowerVN" <no-reply@kflowervn.site>';
    const mailTransporter = getTransporter();

    if (!mailTransporter) {
      console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return true;
    }

    try {
      const info = await mailTransporter.sendMail({
        from: sender,
        to,
        subject,
        text: text || "Vui lòng xem nội dung email bằng trình duyệt hỗ trợ HTML.",
        html,
      });
      logger.info(`[email] Đã gửi email thành công tới ${to} (MessageId: ${info.messageId})`);
      return true;
    } catch (err) {
      logger.error(`[email] Lỗi khi gửi email tới ${to}:`, err);
      return false;
    }
  },

  sendNewOrderEmails: async ({ order, customerEmail }) => {
    if (!order) return;

    // 1. Gửi email xác nhận cho khách hàng nếu có địa chỉ email
    const recipientEmail = customerEmail || order.customer_email || order.user?.email;
    if (recipientEmail) {
      emailUtils
        .sendEmail({
          to: recipientEmail,
          subject: `🌸 Xác nhận đơn hàng #${order.order_number} — Hoa Tươi KFlowerVN`,
          html: renderCustomerOrderHtml(order),
        })
        .catch((e) => logger.error("[email] Lỗi gửi mail khách hàng:", e));
    }

    // 2. Gửi email cảnh báo đơn mới cho Admin / Chủ shop
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      emailUtils
        .sendEmail({
          to: adminEmail,
          subject: `🔔 [ĐƠN HÀNG MỚI] #${order.order_number} - ${formatVND(order.total_amount)} - ${order.recipient_name}`,
          html: renderAdminAlertHtml(order),
        })
        .catch((e) => logger.error("[email] Lỗi gửi mail admin:", e));
    }
  },

  sendPaymentSuccessEmails: async (order, customerEmail = null) => {
    if (!order) return;
    const recipientEmail = customerEmail || order.customer_email || order.user?.email;

    if (recipientEmail) {
      emailUtils
        .sendEmail({
          to: recipientEmail,
          subject: `✅ Xác nhận thanh toán thành công đơn hàng #${order.order_number} — KFlowerVN`,
          html: renderPaymentSuccessHtml(order),
        })
        .catch((e) => logger.error("[email] Lỗi gửi mail xác nhận thanh toán:", e));
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      emailUtils
        .sendEmail({
          to: adminEmail,
          subject: `💰 [ĐÃ THANH TOÁN] Đơn hàng #${order.order_number} đã được thanh toán ${formatVND(order.total_amount)}`,
          html: renderPaymentSuccessHtml(order),
        })
        .catch((e) => logger.error("[email] Lỗi gửi mail thanh toán cho admin:", e));
    }
  },
};

module.exports = emailUtils;
