const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// Serve static files (CSS, JS, HTML)
app.use(express.static('public'));

app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/blog', function(req, res, next) {
    res.render('blog');
});

// Route to handle form submission
app.post('/mail-sender', (req, res) => {
  const { name, email, date, time, service, phone, message } = req.body;

  // Create a transporter using your email credentials
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'riteshrimal01@gmail.com',
      pass: process.env.EMAIL_PASS || 'shbk rucb xwsn zdxe'
    }
  });

  // Define the email options
  let mailOptions = {
    from: process.env.EMAIL_USER || 'riteshrimal01@gmail.com',
    to: process.env.BARBER_EMAIL || 'businesriteshrimal@gmail.com',
    subject: `New Appointment Request from ${name}`,
    text: `
      New Appointment Request:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Date: ${date}
      Time: ${time}
      Service: ${service}
      Message: ${message}
    `,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  // Send the email
  setTimeout(() => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ success: false, message: 'Error sending appointment request. Please try again.' });
      } else {
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ 
          success: true, 
          message: 'Appointment request sent successfully. We will contact you soon.'
        });
      }
    });
  }, 2000); // 2 second delay
});;
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});