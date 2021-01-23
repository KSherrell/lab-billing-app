let labBillingApp_Id = "1FdvMqatXz31uo0-iOTRPTcfdMKPW1khHqusK-_w5G0g";
let smithId = "1lKZcmQg0nyhcsi3PHAeoZ6xuame5YI3va9MySfzR9OI";

function sampleIntake() {
    let tmp_sampleIntake = HtmlService.createTemplateFromFile('lab_sampleIntake');
    tmp_companyNameList = fetchActiveCustomers();
    ui.showSidebar(tmp_sampleIntake.evaluate().setTitle("Lab: Sample Intake"));
}

function labJobComplete() {
    let tmp_lab_jobComplete = HtmlService.createTemplateFromFile('lab_jobComplete');
    ui.showSidebar(tmp_lab_jobComplete.evaluate().setTitle("Lab: Job Complete"));
}

function hCCA() {
    //oh, the judginess! -- and besides, Deann already asked this to be configurable by the user, so it will be moved to a spreadsheet
       let hardCodedCheatingArr = [
"Natural Gas 6+/C7+  (GPA 2261)",
"Natural Gas 6+/C7+ with H2S or O2  (GPA 2261)",
"Refinery Gas 6+/C7+  (ASTM D1945/ UOP539)", 
"Natural Gas Extended C10+, BTEX  (GPA 2286)",
"Gas HSE Fee  (Fees)",
"NGL/LPG/Pure Product C6+/C7+  (GPA 2177)",
"Condensate/Crude Oil C6+  (GPA 2103M)",
"Condensate/Crude Oil C7+  (GPA 2103M)",
"NGL/LPG/Pure Product Extended C10+  (GPA 2186)",
"Condensate/Crude Oil C10+  (GPA 2103/2186M)",
"Condensate/Crude Oil C31+  (GPA 2186M)",
"Sulfur Analysis  (ASTM D5623)",
"Detailed Hydrocarbon Analysis  (ASTM D 6730)",
"Refinery Liquid Analysis  (ASTM 4424)",
"RVP Analysis #1 (Petroleum Products)  (ASTM D 5191)",
"RVP Analysis #2 (Crude Oil)  (ASTM D 6377)",
"H2S in Crude Oil  (ASTM D 5705)",
"Distillation/Liquid Hydrocarbon  (ASTM D 86)",
"BS & W Analysis  (ASTM D 4007)",
"Condensate/Crude Oil Shrinkage  (API 20.1M)",
"API Gravity of Crude/ Light Petroleum products  (ASTM D 1298)",
"API/ Specific Gravity of Crude Oil by Hydrometer  (ASTM D 287)",
"Natural Gas Extended C9 BLM (GPA 2261)"
    ];

    return hardCodedCheatingArr;
}

function getCustomQuoteArray(tabName, compName){
let quoteTab = SpreadsheetApp.openById(labBillingApp_Id).getSheetByName(tabName);
let customQuote = quoteTab.createTextFinder(compName).matchCase(true).matchEntireCell(true).findNext();

if(!customQuote){
return;
}
let quoteRow = customQuote.getRow();
let cols = 23;//there are 23 lab tests right now
let myArray = [
        "labtest01",
        "labtest02",
        "labtest03",
        "labtest04",
        "labtest05",
        "labtest06",
        "labtest07",
        "labtest08",
        "labtest09",
        "labtest10",
        "labtest11",
        "labtest12",
        "labtest13",
        "labtest14",
        "labtest15",
        "labtest16",
        "labtest17",
        "labtest18",
        "labtest19",
        "labtest20",
        "labtest21",
        "labtest22",
        "labtest23"
    ];

let customQuoteArr = quoteTab.getRange(quoteRow, 3, 1, cols).getValues()[0];
let greenQuotesArr = [];
let len = customQuoteArr.length;

for(i = 0; i< len; i++){

  if(customQuoteArr[i] != ""){
     greenQuotesArr.push(myArray[i])
    }
}
    return greenQuotesArr;
}

//this function is smith-tab-specific -- ON PURPOSE, FutureMe. :) 
function fetchActiveCustomers(origin) {
    let masterListSheet = SpreadsheetApp.openById(smithId).getSheetByName("MASTER_LIST_COMPANY_NAMES");
    
    //to return the active customers, for now -- will inform from the customerData tab during updateCustomer coding
    let lr = masterListSheet.getLastRow();
    let smith_activeCustArr = masterListSheet.getRange(2, 1, lr, 3).getValues(); 
    let activeCustomers = [];
    let custListObj = {};
    let theListHtml = '';
    activeCustomers = smith_activeCustArr.filter(function (cust) {
        return cust[0] == false;
    })
    let len = activeCustomers.length;
    if (origin == "autoComp") {
        for (let i = 0; i < len; i++) {
            custListObj[activeCustomers[i][1]] = null
        }
        return custListObj;
    } else if (origin == "autoCompCode") {
        for (let i = 0; i < len; i++) {
            custListObj[activeCustomers[i][2]] = null
        }
        return custListObj;
    } else {
        for (let i = 0; i < len; i++) {
            theListHtml += '<option>' + activeCustomers[i][1] + '</option>';
        }
        return theListHtml;
    }
};


function logJobComplete(dataObj) {
    let labJobCompletedDate = new Date().toDateString();
    let completedJobId = dataObj.labJobId;
    let labBilling = SpreadsheetApp.openById(labBillingApp_Id);
    let tab = labBilling.getSheetByName("labSamples");
    let range = tab.createTextFinder(completedJobId).matchCase(true).matchEntireCell(true).findNext();
    
    if (!range) {
        return 'notFound'
    };
    
    
    let row = range.getRow();
    //labJobCompletedDate is in col 57
    let alreadyLogged = tab.getRange(row, 57).getValue();

    if (alreadyLogged) {
        ui.alert("This job was logged as Complete on " + alreadyLogged);
        return "OOPS"
    }
    
    //write the values to the job complete cells
   tab.getRange(row, 52).setValue(dataObj.collectionFees); 
   tab.getRange(row, 53).setValue(dataObj.liquidHD);
   tab.getRange(row, 54).setValue(dataObj.cylRental);
   tab.getRange(row, 55).setValue(dataObj.chemConsult);
   tab.getRange(row, 56).setValue(dataObj.pistonRental);
   tab.getRange(row, 57).setValue(labJobCompletedDate);
    
    //proper formatting is so important
    tab.getRange(row, 1, 1, 57).setBackground("#eeffd5");
    tab.getRange(row, 58).insertCheckboxes();
    
    try {
        //send mail: recipient, subject, body, options
        GmailApp.sendEmail('kim.sherrell@mobiedev.com', 'Lab Job Complete', 'Hi!\n\nLab services have been completed for job ID:  ' + completedJobId  ) + "\n\nHave a great day!\n--Kim :)";
    } catch (err) {
        console.error(err)
    };
    return "AOK";
}

//in case I need to capture the formObj before it goes to submitForm()
function scrubForm(formObj) {
    return submitForm(formObj);
}

function getTheCompCode(compName) {
    let smith = SpreadsheetApp.openById(smithId);
    let range = smith.getSheetByName("MASTER_LIST_COMPANY_NAMES").createTextFinder(compName).matchCase(true).matchEntireCell(true).findNext();
    let row = range.getRow();
    let code = smith.getSheetByName("MASTER_LIST_COMPANY_NAMES").getRange(row, 3).getValue();
    return code;
};

function getDropDownArray() {
    let labBilling = SpreadsheetApp.openById(labBillingApp_Id);
    //the OneBigListofFieldNames
    let tab = labBilling.getSheetByName("fieldNames");
    let lastRow = tab.getLastRow();
    return tab.getRange(2, 1, lastRow, 4).getValues();
}

//The Big Commit (the backend)
function submitForm(formObj) {

  //variables, variables!
    let labMoneysArr = [];
    let labBilling = SpreadsheetApp.openById(labBillingApp_Id);
    let smith = SpreadsheetApp.openById(smithId);

    //get custom quotes
    let quoteTab = labBilling.getSheetByName("labQuotes");
  
  //need this for sure
  let defaultQuoteArr = quoteTab.getRange(2, 3, 1, 23).getValues()[0];
   let quoteRow = quoteTab.createTextFinder(formObj.companyName).matchEntireCell(true).findNext().getRow();

      if(!quoteRow) { quoteRow = 2};
       
    //marry defaultPricesArr and customQutoesArr
    //there are 25 cols in quoteTab, I need 23 of them, starting at col C
    let quoteRates = quoteTab.getRange(quoteRow, 3, 1, 23).getValues()[0]; //don't take the first two cols data
  
  for(let i = 0; i < quoteRates.length; i++ ){
        if(quoteRates[i] == 0){
        quoteRates.splice([i], 1, defaultQuoteArr[i])
  
        }
      }
    //assign money to the labTests
    for (i = 0; i < quoteRates.length; i++) {
        if (formObj.checkArr[i] == false) {
            labMoneysArr.push(0);
        } else {
            labMoneysArr.push(quoteRates[i]);
        }
    }


  //get the customer billing info from smith
    let billTab = smith.getSheetByName("companyData");
    let billRange = billTab.createTextFinder(formObj.compCode).matchCase(true).matchEntireCell(true).findNext();
    let billRow = billRange.getRow();
    //cols with this data are 15-21 -- no. Maybe later. -- yes, will def but later
    let billData = billTab.getRange(billRow, 15, 1, 7).getValues()[0];
 
    //Marci's playground :) 
    //will need the hardCodedCheatingArray
    let hardCodedCheatingArray = hCCA();
    let hccaLen = hardCodedCheatingArray.length;
    let marciCellContents = "";
    for (i = 0; i < hccaLen; i++) {
        if (formObj.checkArr[i] == true) {
            marciCellContents += hardCodedCheatingArray[i] + ": " + labMoneysArr[i] + ", "
        }
    }

    //create the arrays for the appendRow - put values into variables for readabilty
    let createdOnDate = formObj.createdOnDate;
    let regionName = formObj.regionName;
    let compCode = formObj.compCode;
    let compName = formObj.companyName;
    let labJobId = formObj.labJobId;
    let sampleDate = formObj.sampleDate;
    let sampledBy = formObj.sampledBy;
    let fieldName = formObj.fieldName;
    let stationName = formObj.stationName;
    let sampleMeterID = formObj.sampleMeterID;
    let sampleType = formObj.sampleType;
    let sampleTemperature = formObj.sampleTemperature;
    let samplePressure = formObj.samplePressure;
    let cylinderNumber = formObj.cylinderNumber;
    let cylinderVolume = formObj.cylinderVolume;
    let customerOwnBottle = formObj.customerOwnBottle;
    let returnCylinder = formObj.returnCylinder;
    let recvCylinder = formObj.recvCylinder;
    let labLeadTime = formObj.labLeadTime;
    let labDeadline = formObj.labDeadline;

    let appendage = [
        createdOnDate,
        compCode,
        compName,
        labJobId,
        sampledBy,
        sampleMeterID,
        sampleType,
        sampleTemperature,
        samplePressure,
        cylinderNumber,
        cylinderVolume,
        customerOwnBottle,
        returnCylinder,
        recvCylinder,
        labLeadTime,
        labDeadline
    ].concat(labMoneysArr, billData, sampleDate, fieldName, stationName, regionName, marciCellContents);

    //write it to LIMS Billing App
    labBilling.getSheetByName("labSamples").appendRow(appendage);

//if it's a new location, write that to the fieldNames tab

if (formObj.newFieldName){
let newAppendage = [compName, formObj.newFieldName, formObj.newStationName, formObj.newSampleMeterID];
SpreadsheetApp.openById(labBillingApp_Id).getSheetByName("fieldNames").appendRow(newAppendage);

}

    //send the formObj to the pdf 
    return createAndMailLabPDF(formObj); //the trigger

}; //end submitForm()



function createAndMailLabPDF(formObj) {

    let labPDFTemplate = DriveApp.getFileById('1bbfn-zlkKn1DacU_PGKnXlRmhreme7vpFmlaeXfkNPU');
    let labPDFFolder = DriveApp.getFolderById('1363ABXFMvWqGzl9rJgFmk_HnO8wuu5BF');

    //.makeCopy is a method, need some arguments
    let labPDFTemplateCopy = labPDFTemplate.makeCopy(labPDFFolder);
    let pdfID = labPDFTemplateCopy.getId();
    let labPDFDoc = DocumentApp.openById(pdfID);

    //get the doc body in order to make changes to template contents
    let labPDFDocBody = labPDFDoc.getBody();

    //replaceText methods yay!
    labPDFDocBody.replaceText('{{barCode}}', formObj.barCode);
    labPDFDocBody.replaceText('{{labJobId}}', formObj.labJobId);

    labPDFDocBody.replaceText('{{createdOnDate}}', formObj.createdOnDate);
    labPDFDocBody.replaceText('{{labLeadTime}}', formObj.labLeadTime);
    labPDFDocBody.replaceText('{{labDeadline}}', formObj.labDeadline);

    labPDFDocBody.replaceText('{{companyName}}', formObj.companyName);
    labPDFDocBody.replaceText('{{sampledBy}}', formObj.sampledBy);

    labPDFDocBody.replaceText('{{sampleDate}}', formObj.sampleDate);

    labPDFDocBody.replaceText('{{fieldName}}', formObj.fieldName);
    labPDFDocBody.replaceText('{{stationName}}', formObj.stationName);

    labPDFDocBody.replaceText('{{sampleMeterID}}', formObj.sampleMeterID);

    labPDFDocBody.replaceText('{{sampleType}}', formObj.sampleType);
    labPDFDocBody.replaceText('{{sampleTemperature}}', formObj.sampleTemperature);
    labPDFDocBody.replaceText('{{samplePressure}}', formObj.samplePressure);

    labPDFDocBody.replaceText('{{cylinderNumber}}', formObj.cylinderNumber);
    labPDFDocBody.replaceText('{{cylinderVolume}}', formObj.cylinderVolume);
    labPDFDocBody.replaceText('{{customerOwnBottle}}', formObj.customerOwnBottle);

    //for to make it pretty 
    let hardCodedCheatingArr = hCCA();
    let hccaLen = hardCodedCheatingArr.length
    let sortedCheckArr = [];
    for (i = 0; i < hccaLen; i++) {
        if (formObj.checkArr[i] == true) {
            sortedCheckArr.push(hardCodedCheatingArr[i])
        }
    }
    //yeah, I did -- you're not here doing the work, so ... 
    for (i = 0; i < hccaLen; i++) {
        if (sortedCheckArr[i]) {
            labPDFDocBody.replaceText('{{lab' + [i] + '}}', sortedCheckArr[i]);
        } else {
            labPDFDocBody.replaceText('{{lab' + [i] + '}}', "");
        }
    }
    //save and close the document
    labPDFDoc.saveAndClose();
    let labPDFDocId = DriveApp.getFileById(labPDFDoc.getId());
    let labPDFAttachment = labPDFDocId.getAs(MimeType.PDF);
    //let confirmationEmail = formObj.confirmationEmail;
    let confirmationEmail = "kim.sherrell@mobiedev.com";
    try {
        //send mail: recipient, subject, body, options
        GmailApp.sendEmail(confirmationEmail, 'Sample Intake Information', 'Attachment: ' + formObj.labJobId, {
            'attachments': [labPDFAttachment]
        });

    } catch (err) {
        console.error(err)
    };

    return 'AOK'; //pull the trigger already! 

};