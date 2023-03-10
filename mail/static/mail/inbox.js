/*
Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of inbox.js (and not additional or other files; for grading purposes, we’re only going to be considering inbox.js!). You must fulfill the following requirements:

Send Mail: When a user submits the email composition form, add JavaScript code to actually send the email.
You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.
Once the email has been sent, load the user’s sent mailbox.
 */

// if post request compose email then Load the user’s sent mailbox

document.addEventListener('DOMContentLoaded', function() {
  // Three different views: inbox, sent, and archive
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  // Add functionality to button to send the email
  // Once the email has been sent, load the user’s sent mailbox.
  // if form is submitted, go to send email  load_mailbox(sent), if form is not submitted, go to inbox

  document.querySelector('#compose-form').addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the values from the form
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Send the email
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
        .then(response => response.json())
        .then(result => {
          // Print result
          console.log(result);
          load_mailbox('sent')
        });
  })
}



// Add functionality to show any of three inboxes: inbox, sent, and archive
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch the emails
}