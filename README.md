# Lab Billing App example
## Description

The Lab Billing App is a Sheets application that allows our lab team to log customer field samples sent to our lab for testing. At Job Complete, the app writes the billing data to line items for easy retrieval by the AR Specialist. It also pulls in customer contact data from a customer db, ensuring that the Lab Manager in TX is using the same customer list (literally) as our AR Specialist in WY. 

The Lab Billing App's local db holds customer contract quotes, default prices, and test names for 23 lab tests.

Bonus: this code example shows access to the main customer db via a submenu item in the Lab Billing app.

## Features
- Custom menu and user interface, UI opens in right sidebar
- Cascading drop-down selection lists
- Holds customer contract quotes for lab services as well as default prices for services
    - lab services with custom quotes attached are highlighted in the selection checklist
- Field locations lists managed locally, from a tab in the workbook
- Allows the user to add a new field location on the fly during the Sample Intake process
- Each lab sample logged recieves a unique identifier
- Creates a PDF containing the sample information and the services requested
    - emails the PDF
- When the Lab Manager clicks Job Complete, an email notification is sent to the billing team

## Screenshots
- In the screenshots folder, there are 9 shots of the Lab Billing App in action

## Project Tech
- Javascript
- jQuery
- Node, npm
- Google App Script
- CLASP
- Visual Studio Code
- HTML 
- CSS
- Materialize.css
- Github
- Git, Windows command line
- Google Drive, Sheets, Gmail

## Working on next ...
- Adding a few fields to the Job Complete form to help capture and communicate information about additional fees to the billing team  
- Re-working the way the custom quotes and default prices lists are managed 
