require("dotenv").config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/send-inquiry', async (req, res) => {
  const { name, email, message, products,
    mobileNum,
    companyName,
    quantity,
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    }
  });


  const mailOptions = {
    from: `"${name}" <Evergrow@evergrow.ae>'`,
    to: process.env.TO_EMAIL,
    replyTo: email, 
    subject: `New Inquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007BFF;">New Product Inquiry</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${mobileNum}</p>
      <p><strong>Products Interested:</strong> ${products.join(', ')}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      ${message
        ? `<p><strong>Additional Message:</strong><br>${message}</p>`
        : ''
      }

      <hr style="margin: 20px 0;" />
      <p style="font-size: 0.9em; color: #999;">This inquiry was submitted from your website contact form.</p>
    </div>
    `
  };

  

  try {
    await transporter.sendMail(mailOptions);

    const userMail = {
      from: `"EverGrow" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for reaching out to us. We’ve received your message and will get back to you shortly.</p>
        <hr />
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Best regards,<br/>EverGrow Team</p>
      `,
    };

    await transporter.sendMail(userMail);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
