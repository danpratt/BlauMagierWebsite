const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });'
'use strict';

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/messages/{uid}').onWrite(event => {
  const snapshot = event.data;
  const val = snapshot.val();

  const name = val.name;
  const message = val.message;
  const email = val.email;

  const message_to_send = 'Hi Daniel,\n\nYou have a message from: ' + name + '\nemail: ' + email + '\nmessage: ' + message;

  const mailOptions = {
    from: '"Firebase Realtime Database for Blau Magier" <noreply@firebase.com>',
    to: 'daniel@blaumagier.com'
  };
  
  // Building Email message.
  mailOptions.subject = 'New Message on Firebase';
  mailOptions.text = message_to_send;
  
  return mailTransport.sendMail(mailOptions)
    .then(() => console.log(`New message from: `, val.email))
    .catch(error => console.error('There was an error while sending the email:', error));
});