/*
Using JavaScript, HTML, and CSS, complete the implementation of your single-page-app email client inside of inbox.js (and not additional or other files; for grading purposes, we’re only going to be considering inbox.js!). You must fulfill the following requirements:

Archive and Unarchive: Allow users to archive and unarchive emails that they have received.
When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
Recall that you can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.
Once an email has been archived or unarchived, load the user’s inbox.
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
            // Change the read status to true
            // Show the mailbox and hide other views
            document.querySelector('#compose-view').style.display = 'none';
            document.querySelector('#emails-view').style.display = 'none';
            document.querySelector('#detail-email-view').style.display = 'block';
            mark_email_as_read(email.id)
            view_mail(email.id)

          });

          // Append the table data to the table row
          if (mailbox === 'sent') {
            emailTableRow.append(add_text_to_element('td', recipients));          }
          else {
            emailTableRow.append(add_text_to_element('td', sender));
          }
          emailTableRow.append(add_text_to_element('td', subject));
          emailTableRow.append(add_text_to_element('td', timestamp));

          // Add button to archive or unarchive the email
          // Arhive on inbox, unarchive on archive

          const archiveButton = document.createElement('button');
          archiveButton.className = 'btn btn-outline-primary';
            if (mailbox === 'inbox') {
                archiveButton.textContent = 'Archive';
                archiveButton.addEventListener('click', function (event) {
                    console.log('Archive button clicked')
                    emailTableRow.append(add_text_to_element('td', archiveButton));


                    archive_email(email.id);
                });
            }
            else if (mailbox === 'archive') {
                archiveButton.textContent = 'Unarchive';
                archiveButton.addEventListener('click', function (event) {
                    emailTableRow.append(add_text_to_element('td', archiveButton));
                    unarchive_email(email.id);
                });
            }
            // else do nothing
            else {
                archiveButton.innerHTML = '';
            }
          // if the email is read, change the background color to grey
          // HTML DOM API, url
          if (read) {
            emailTableRow.className = 'table-secondary';
          }
          emailTableRow.append(add_text_to_element('td', archiveButton));

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
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
      });

      parent.append(add_text_to_element('hr'));
      parent.append(add_text_to_element('p', email.body));

    });

}

// function that creates a HTML element and adds a text to it
function add_text_to_element(tag, text) {
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

function mark_email_as_read(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });
}

// function that archives an email
function archive_email(id) {
    fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
    })
    .then(() => {
        load_mailbox('inbox');
    });
}
// function that unarchives an email
function unarchive_email(id) {
    fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
    })
    .then(() => {
        load_mailbox('inbox');
    });
}