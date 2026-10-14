const emailUtils = {
  sendEmail: async ({ to, subject, html }) => {
    // Dummy email sender. In a real app, use nodemailer.
    console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL BODY] ${html}`);
    return true;
  }
};

module.exports = emailUtils;
