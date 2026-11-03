"use strict";

const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const logger = require("./logger");

let oauthClient = null;

function getClient() {
  if (!oauthClient) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      oauthClient = new OAuth2Client(clientId);
    }
  }
  return oauthClient;
}

const googleOAuthUtils = {
  getClientId: () => {
    return process.env.GOOGLE_CLIENT_ID || "";
  },

  verifyIdToken: async (idToken) => {
    if (!idToken) {
      const err = new Error("Mã xác thực Google (credential) không được để trống.");
      err.statusCode = 400;
      throw err;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    // Cách 1: Xác thực qua google-auth-library
    try {
      const client = getClient();
      if (client && clientId) {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email) {
          return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.given_name || "Khách hàng Google",
            picture: payload.picture || null,
            emailVerified: payload.email_verified || false,
          };
        }
      }
    } catch (libErr) {
      logger.warn("[google-auth] verifyIdToken qua library không thành công, chuyển sang tokeninfo endpoint: " + libErr.message);
    }

    // Cách 2: Fallback qua Google tokeninfo endpoint trực tiếp
    try {
      const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, {
        timeout: 10000,
      });
      const data = res.data;
      if (!data || !data.email) {
        throw new Error("Invalid Google token payload");
      }
      return {
        googleId: data.sub,
        email: data.email,
        name: data.name || "Khách hàng Google",
        picture: data.picture || null,
        emailVerified: data.email_verified === "true" || data.email_verified === true,
      };
    } catch (apiErr) {
      logger.error("[google-auth] Token verification failed: " + apiErr.message);
      const err = new Error("Xác thực tài khoản Google không thành công. Token không hợp lệ hoặc đã hết hạn.");
      err.statusCode = 401;
      throw err;
    }
  },
};

module.exports = googleOAuthUtils;

