const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

handlebars.registerHelper("eq", (a, b) => a == b)

// Set up mail transport
const mailTransport = nodemailer.createTransport({
  host: process.env.SMS_HOST,
  port: process.env.SMS_PORT,
  secure: false, // false for STARTTLS
  requireTLS: true, // Use STARTTLS
  auth: {
    user: process.env.SMS_USER,
    pass: process.env.SMS_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

mailTransport.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log("Server is ready to take our messages")
  }
})

const sendMailNotification = async (
  to_email,
  subject,
  substitutional_parameters,
  Template_Name
) => {
  try {
    const source = fs.readFileSync(
      path.join(__dirname, `../templates/${Template_Name}.hbs`),
      "utf8"
    )
    const compiledTemplate = handlebars.compile(source)

    const mailOptions = {
      from: '"Intellio" <info@intellio.academy>', // sender address
      to: to_email, // list of receivers
      subject: subject, // Subject line
      html: compiledTemplate(substitutional_parameters),
    }

    await mailTransport.sendMail(mailOptions)
    console.log(`Email sent to ${to_email}`)
  } catch (error) {
    console.error(`Error sending email to ${to_email}:`, error)
  }
}

module.exports = { sendMailNotification }
