// controllers/contactController.js
const Contact = require('../model/contactModel'); // Ensure you have a Contact model
const nodemailer = require('nodemailer');

const sendContactMessage = async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill out all fields."
        });
    }

    try {
        // Save the contact message to the database (optional)
        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });

        await newContact.save();

        // Send an email notification (optional)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'recipient-email@example.com',
            subject: 'New Contact Message',
            text: `You have a new message from ${name} (${email}, ${phone}):\n\n${message}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
};

module.exports = { sendContactMessage };
