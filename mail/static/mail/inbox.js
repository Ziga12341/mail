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
/**
 * Load mailbox
 * GET /emails/<str:mailbox>
 * Sending a GET request to /emails/<mailbox> where <mailbox> is either inbox, sent, or archive will return back to you (in JSON form) a list of all emails in that mailbox, in reverse chronological order. For example, if you send a GET request to /emails/inbox, you might get a JSON response like the below (representing two emails):
 *
 * [
 *     {
 *         "id": 100,
 *         "sender": "foo@example.com",
 *         "recipients": ["bar@example.com"],
 *         "subject": "Hello!",
 *         "body": "Hello, world!",
 *         "timestamp": "Jan 2 2020, 12:00 AM",
 *         "read": false,
 *         "archived": false
 *     },
 *     {
 *         "id": 95,
 *         "sender": "baz@example.com",
 *         "recipients": ["bar@example.com"],
 *         "subject": "Meeting Tomorrow",
 *         "body": "What time are we meeting?",
 *         "timestamp": "Jan 1 2020, 12:00 AM",
 *         "read": true,
 *         "archived": false
 *     }
 * ]
 * Notice that each email specifies its id (a unique identifier), a sender email address, an array of recipients, a string for subject, body, and timestamp, as well as two boolean values indicating whether the email has been read and whether the email has been archived.
 *
 * How would you get access to such values in JavaScript? Recall that in JavaScript, you can use fetch to make a web request. Therefore, the following JavaScript code
 * @param mailbox type of mailbox inbox, sent, or archive - string
 * @returns {Promise<void>}
 * fetch('/emails/inbox')
 *    .then(response => response.json())
 *    .then(emails => {
 *    // Print emails
 */
function load_mailbox(mailbox) {
  console.log(`Loading ${mailbox} mailbox...`);

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Fetch the emails
  fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
        emails.forEach(email =>{
          // emails
          email.archived = false;
          const sender = email.sender;
          const subject = email.subject;
          const body = email.body;
          const timestamp = email.timestamp;
          const read = email.read;
          const archived = email.archived;
          const recipients = email.recipients;

          // Print each email in console
          // Create a div element for each email
          // Use bootstrap table to display the emails
          // do not use inerHTML
          // td = table data, tr = table row

          // Create a row for the column names
          const emailTable = document.createElement('table');
          emailTable.className = 'table table-bordered';
          const emailTableHead = document.createElement('thead');
          const emailTableBody = document.createElement('tbody');
          const emailTableRow = document.createElement('tr');
          const emailTableDataSender = document.createElement('td');
          const emailTableDataRecipient = document.createElement('td');
          const emailTableDataSubject = document.createElement('td');
          const emailTableDataTimestamp = document.createElement('td');
          const emailTableDataRead = document.createElement('td');

          // if the email is read, change the background color to grey
          if (read) {
              emailTableRow.className = 'table-secondary';
            }

          // Add the sender, subject, timestamp, and read to the table
          emailTableDataSender.innerHTML = sender;
          emailTableDataRecipient.innerHTML = recipients;
          emailTableDataSubject.innerHTML = subject;
          emailTableDataTimestamp.innerHTML = timestamp;
          emailTableDataRead.innerHTML = read;

          // Append the table data to the table row
          if (mailbox === 'sent') {
            emailTableRow.append(emailTableDataRecipient)
          }
          else {
          emailTableRow.append(emailTableDataSender);
          }
          emailTableRow.append(emailTableDataSubject);
          emailTableRow.append(emailTableDataTimestamp);

          emailTableBody.append(emailTableRow);
          emailTable.append(emailTableBody);

          // Append the table to the emails view
          document.querySelector('#emails-view').append(emailTable);
          console.log(email);

        });
      });
}