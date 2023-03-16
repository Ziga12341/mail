// if post request compose email then Load the user’s sent mailbox

document.addEventListener('DOMContentLoaded', function() {
  // Three different views: inbox, sent, and archive
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // When a user submits the email composition form, add JavaScript code that sends an email.
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

  // By default, load the inbox
  load_mailbox('inbox');
});

// Function compose_email() compose an email
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#detail-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// Load three inboxes: inbox, sent, and archive
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
              // do something with each email
              const sender = email.sender;
              const subject = email.subject;
              const timestamp = email.timestamp;
              const read = email.read;
              const recipients = email.recipients;
              const button = document.createElement('button');
              button.className = 'btn btn-primary';

              // Print each email in console
              // Create a row for the column names
              const emailTableRow = document.createElement('tr');
              emailTableBody.append(emailTableRow);

              // When click on email row, show the detail email
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

              // do not show the archive button in the sent mailbox
              if (mailbox === 'sent') {
                  add_elements_to_table_row(emailTableRow, recipients, subject, timestamp)
                }
              else if (mailbox === 'archive') {
                  add_elements_to_table_row(emailTableRow, sender, subject, timestamp)
                  button.textContent = 'Unarchive';
                  emailTableRow.append(button);
                  button.addEventListener('click', function (event) {
                        console.log(`Email ${email.id} was clicked!`);
                        unarchive_email(email.id)
                  });
                }
              else {
                  add_elements_to_table_row(emailTableRow, sender, subject, timestamp)
                  button.textContent = 'Archive';
                  emailTableRow.append(button);
                  button.addEventListener('click', function (event) {
                        console.log(`Email ${email.id} was clicked!`);
                        archive_email(email.id)
                  });
              }

              // if the email is read, background color changes to grey
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
// function view_mail(id) shows the detail email

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

            const replyButton = document.createElement('button');
            replyButton.textContent = 'Reply';
            replyButton.className = 'btn btn-primary';
            parent.append(replyButton);
            replyButton.addEventListener('click', () => {
                compose_email();
                document.querySelector('#compose-recipients').value = email.sender;
                if (!email.subject.startsWith('Re: ')) {
                  email.subject = `Re: ${email.subject}`;
                }
                document.querySelector('#compose-subject').value = email.subject;
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

// When a user submits the email composition form, add JavaScript code to actually send the email.
function add_elements_to_table_row(emailTableRow, from_or_to, subject, timestamp) {
    emailTableRow.append(add_text_to_element('td', from_or_to));
    emailTableRow.append(add_text_to_element('td', subject));
    emailTableRow.append(add_text_to_element('td', timestamp));
}