const { Router } = require("express");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { transporter, emailValidation } = require("../controllers/authMail.js");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = Router();

router.post("/", async (req, res) => {
  try {
    let { email, type } = req.body;
    let validate = await emailValidation(email)
    if (typeof validate !== "object") {
      try {
        await transporter.sendMail({
          from: '"Proyecto Grupal - Changuitas ✔',
          to: `${email}`,
          subject: "Email",
          html: `<b>Email Verification ! ${type}</b>`,
        });
        return res.status(200).json(`Email de verificacion: ${type}`);
      } catch (error) {
        return res
          .status(400)
          .send("No se pudo enviar el email de verificacion.");
      }
    }
  } catch (error) {
    console.log(`Error aca papa: ${error}`);
    return res.status(400).send(error);
  }
});

module.exports = router;
