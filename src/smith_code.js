let activeWorkbook = SpreadsheetApp.getActiveSpreadsheet(); //the open and active workbook
let activeSheet = activeWorkbook.getActiveSheet(); //this is the open sheet in the workbook
let activeRange = activeSheet.getActiveRange();//selected cell or range of cells in the open sheet
let ui = SpreadsheetApp.getUi();

//when the app opens ... 
function onOpen(e) {

//create the custom menu 
SpreadsheetApp.getUi()
.createMenu('LAB SAMPLE INTAKE')
.addItem('Sample Intake', 'sampleIntake')
.addItem('Job Complete', 'labJobComplete')
.addSeparator()
.addSubMenu(SpreadsheetApp.getUi().createMenu('Smith')
  .addItem('Add Customer', 'addCustomer')
  .addItem('Update Customer', 'updateCustomer')
  .addItem('View Customer', 'viewCustomer'))
.addToUi();
let openingTab = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("onOpen").activate(); //the open and active workbook
}

function include(filename){
return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function updateCustomer(){
let tmp_smith_updateCustomer = HtmlService.createTemplateFromFile('smith_updateCustomer');
ui.showSidebar(tmp_smith_updateCustomer.evaluate().setTitle("Smith: Update Customer"));
}

function viewCustomer(){
let tmp_smith_viewCustomer = HtmlService.createTemplateFromFile('smith_viewCustomer');
ui.showSidebar(tmp_smith_viewCustomer.evaluate().setTitle("Smith: View Customer"));
}

function addCustomer() {
let tmp_smith_addCustomer = HtmlService.createTemplateFromFile('smith_addCustomer');
ui.showSidebar(tmp_smith_addCustomer.evaluate().setTitle("Smith: Add Customer")); 
}

//call workingOnIt whenever I need the loader 
//send along no status if it is a query to the database
//when query results return, call workingOnIt with a status argument
//thank you very much, Past Me for making this easy like Sunday morning :) 

function workingOnIt(status){
let workingTmp = HtmlService.createTemplateFromFile('loader_HTML');
workingTmp.workingContent = "";
let workingDiv = "<div id='loading' class='center-align loading'><a class='btn-floating btn-large red darken-2 pulse'></a><div class='working'>working ...</div></div>";
let openingDiv = "<div id='loading' class='center-align loading'><a class='btn-floating btn-large red darken-2 pulse'></a><div class='working'>opening ...</div></div>";
let readyDiv = "<div id='ready' class='center-align ready'><a class='btn-floating btn-large green'></a><div class='working'>ready</div></div>";
let successDiv = "<div id='ready' class='center-align ready'><a class='btn-floating btn-large blue'></a><div class='working'>success</div></div>";
let notFoundDiv = "<div id='noRMA' class='center-align ready'><a class='btn-floating btn-large grey pulse'></a><div class='working'>not found.</div></div>";
let scriptTag = "<script>window.close = function(){window.setTimeout(function(){google.script.host.close()},2500)};close();</script>";
let dialogTitle = " ";

if(!status){
workingTmp.workingContent = workingDiv;
workingTmp.scriptTag = " ";
}

if(status == "opening"){
workingTmp.workingContent = openingDiv;
workingTmp.scriptTag = scriptTag;
}

if(status == 'ready'){
workingTmp.workingContent = readyDiv;
workingTmp.scriptTag = scriptTag;
}

if(status == 'success'){
workingTmp.workingContent = successDiv;
workingTmp.scriptTag = scriptTag;
}

if(status == "notFound"){
workingTmp.workingContent = notFoundDiv;
workingTmp.scriptTag = scriptTag;
}

workingTmp = workingTmp.evaluate();
workingTmp.setWidth(300).setHeight(150);
SpreadsheetApp.getUi().showModalDialog(workingTmp, dialogTitle);
}

    //FILE UPLOADS -- don't forget, we've got cows, err, file uploads to think about and in two different scenarios:
    //1. Add New Customer -- there won't be an existing folder structure for this new customer, so the script will have to determine that the customer does not exist, then create the customer's folder -- which means that Brandi and Marci need to decide how they want the scirpt to name these folders (maybe just compName?) --
    //2. Update Customer -- the folder structure is already there, script just needs to write the docs to the already existing customer folders.