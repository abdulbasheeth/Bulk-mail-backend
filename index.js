const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed", err));

/* ================= MODEL ================= */
const Credential = mongoose.model("credential", {}, "bulkmail");

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).send("Bulk Mail Backend is running 🚀");
});

/* ================= SEND MAIL API ================= */
app.post("/sendMail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || !emailList.length) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const data = await Credential.findOne();
    if (!data) {
      return res.status(500).json({ error: "Email credentials not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.user,
        pass: data.pass, // Gmail App Password
      },
    });

    for (const email of emailList) {
      await transporter.sendMail({
        from: data.user,
        to: email,
        subject: "Bulk Mail App",
        text: msg,
      });
      console.log(`📧 Email sent to: ${email}`);
    }

    res.status(200).json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("❌ Email sending failed", error);
    res.status(500).json({ success: false, error: "Email sending failed" });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
