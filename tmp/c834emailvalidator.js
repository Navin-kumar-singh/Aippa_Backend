const dns = require('dns');
const net = require('net');
const app = require('.');


// List of disposable email domains (you can add more to this list)
const disposableDomains = [
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  // Add more disposable domains here
];

// Endpoint to verify email format, check for disposable emails, MX records, and email existence
app.post('/verify-email', (req, res) => {
  const email = req.body.email;

  if (!validateEmailFormat(email)) {
    res.status(400).json({ message: 'Invalid email format.' });
  } else if (isDisposableEmail(email)) {
    res.status(400).json({ message: 'Disposable email addresses are not allowed.' });
  } else {
    const domain = email.split('@')[1];
    verifyEmailWithSMTP(domain)
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Email is valid.' });
        } else {
          res.status(400).json({ message: 'Email address does not exist.' });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error verifying email.' });
      });
  }
});

// Function to validate email format
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if an email is from a disposable domain
function isDisposableEmail(email) {
  const domain = email.split('@')[1];
  return disposableDomains.includes(domain);
}

// Function to verify email address using SMTP
function verifyEmailWithSMTP(domain) {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(err);
        return;
      }

      // Sort MX records by priority (ascending order)
      addresses.sort((a, b) => a.priority - b.priority);

      const socket = new net.Socket();
      let verified = false;

      socket.on('connect', () => {
        socket.write(`EHLO yourdomain.com\r\n`);
      });

      socket.on('data', (data) => {
        if (data.toString().startsWith('250')) {
          socket.write(`MAIL FROM:<sender@yourdomain.com>\r\n`);
        } else if (data.toString().startsWith('250 2.1.0')) {
          socket.write(`RCPT TO:<recipient@${domain}>\r\n`);
        } else if (data.toString().startsWith('250 2.1.5')) {
          verified = true;
          socket.end();
        } else {
          socket.end();
        }
      });

      socket.on('end', () => {
        socket.destroy();
        resolve(verified);
      });

      socket.on('error', (error) => {
        reject(error);
      });

      socket.connect(25, addresses[0].exchange); // Connect to the SMTP server with the highest priority
    });
  });
}
