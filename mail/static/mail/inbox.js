/*
Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of inbox.js (and not additional or other files; for grading purposes, we’re only going to be considering inbox.js!). You must fulfill the following requirements:

View Email: When a user clicks on an email, the user should be taken to a view where they see the content of that email.
You’ll likely want to make a GET request to /emails/<email_id> to request the email.
Your application should show the email’s sender, recipients, subject, timestamp, and body.
You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.
See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.
Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.
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
  document.querySelector('#detail-email-view').style.display = 'none';
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

    /*
    Jernej' OR 1=1; ; ; ; /*
    Jernej" OR 1=1; --

    me = query.get('me')

    mysql.query("
        select * from emails; --
    ")
    stmt = mysql.preparedStatement("
        select *
        from emails
        where sender = [me] and recipients = ? and subject = ? and body = ?
        and timestamp = ? and read = ? and archived = ?
    ",

    */

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
  document.querySelector('#detail-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Fetch the emails
  fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
        const emailTable = document.createElement('table');
        emailTable.className = 'table table-bordered';
        const emailTableBody = document.createElement('tbody');
        emailTable.append(emailTableBody);

        emails.forEach(email =>{
          // emails
          email.archived = false;
          const sender = email.sender;
          const subject = email.subject;
          const timestamp = email.timestamp;
          const read = email.read;
          const recipients = email.recipients;

          // Print each email in console
          // Create a div element for each email
          // Use bootstrap table to display the emails
          // td = table data, tr = table row

          // Create a row for the column names
          const emailTableRow = document.createElement('tr');
          emailTableBody.append(emailTableRow);
          // Add link to the email
          emailTableRow.addEventListener('click', function (event) {
            console.log(`Email ${email.id} was clicked!`);
              // Show the mailbox and hide other views
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#detail-email-view').style.display = 'block';
            view_mail(email.id)
          });

          // Append the table data to the table row
          if (mailbox === 'sent') {
            emailTableRow.append(el('td', recipients));          }
          else {
            emailTableRow.append(el('td', sender));
          }
          emailTableRow.append(el('td', subject));
          emailTableRow.append(el('td', timestamp));

          // if the email is read, change the background color to grey
          // HTML DOM API, url
          if (read) {
            emailTableRow.className = 'table-secondary';
          }

          // Append the table to the emails view
          document.querySelector('#emails-view').append(emailTable);
          console.log(email);

        });
      });
}

// When a user clicks on an email, the user should be taken to a view where they see the content of that email.

function view_mail(id){
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      const parent = document.querySelector('#detail-email-view')
      parent.replaceChildren();
      parent.append(label_text('From: ', email.sender));
      parent.append(label_text('To: ', email.recipients.join(', ')));
      parent.append(label_text('Subject: ', email.subject));
      parent.append(label_text('Timestamp: ', email.timestamp));

      const button = document.createElement('button');
      button.textContent = 'Reply';
      parent.append(button);
      button.addEventListener('click', () => {
        compose_email();
        document.querySelector('#compose-recipients').value = sender;
        document.querySelector('#compose-subject').value = `Re: ${subject}`;
        document.querySelector('#compose-body').value = `On ${timestamp} ${sender} wrote: ${body}`;
      });

      parent.append(el('hr'));
      parent.append(el('p', email.body));

    });

}

// function that creates a HTML element and adds a text to it
function el(tag, text) {
  const element = document.createElement(tag);
  if (text) {
      element.textContent = text;
  }
  return element;
}

function label_text(label, text) {
  const p = document.createElement('p');
  const label_element = document.createElement('b');
  label_element.textContent = label;
  p.append(label_element);
  p.append(text);
  return p;
}