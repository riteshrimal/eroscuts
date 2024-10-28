const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Keep only one instance

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add this middleware to parse JSON data
app.use(express.json());

// Set EJS as the view engine and define the views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static('public'));

// Define route for the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Define route for the blog page
app.get('/blog', (req, res) => {
    res.render('blog');
});

// Email transporter configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'msg@eroscuts.com', // or your business email
    pass: process.env.EMAIL_PASS // app password from Gmail
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready');
  }
});

app.post('/mail-sender', async (req, res) => {
  try {
    const { name, email, date, time, service, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !date || !time || !service || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    const mailOptions = {
      from: {
        name: 'Eros Cuts',
        address: 'msg@eroscuts.com' // your business email
      },
      to: process.env.BARBER_EMAIL,
      replyTo: email, // replies will go to the customer
      subject: `New Appointment Request from ${name}`,
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Appointment request sent successfully. We will contact you soon.' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send appointment request. Please try again.' 
    });
  }
});
// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
