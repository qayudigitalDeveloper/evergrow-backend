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
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
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
      ${
        message
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
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
