let smithFolderId = '1zyE2JdsVT-uJotiaWqGsMcY91rSQfEwm';

function preventDup(customerObj) {
    let compCode = customerObj.compCode;
    let smith = SpreadsheetApp.openById(smithId);

    //remember: bc the master customer list is not currently being taken from the companyData tab (it is created @ addNewCustomer), 
    //it is possible to NOT find a company code on the dataTab that IS on the master list, so be aware
    
    let codeLoc = smith.getSheetByName("companyData").createTextFinder(compCode).matchCase(true).matchEntireCell(true).findNext();

    //because I want to return the company name associated with this compCode in Smith, not the company name typed into the search by the user
    //compName is always in col 1

    if (codeLoc) {
        let row = codeLoc.getRow(); //company name is in col 1
        let compName = smith.getSheetByName("companyData").getRange(row, 1).getValue();

        let companyInfo = {
            "compName": compName,
            "compCode": customerObj.compCode
        }
        return companyInfo;

    } else {
        return null;
    }
}

function smith_submitNewCustomer(dataObj) {
  //dear future dev, I choose speed over scalability here. If you are me, you already know why.  XOXO, Kim :)
  
    //get smith
    let smith = SpreadsheetApp.openById(smithId);
    let labBilling = SpreadsheetApp.openById(labBillingApp_Id)
    let companyDataTab = smith.getSheetByName('companyData');
    let labQuotesTab = labBilling.getSheetByName('labQuotes');
    let masterListTab = smith.getSheetByName('MASTER_LIST_COMPANY_NAMES');

    let appendage_compData = [
        dataObj.compName,
        dataObj.compCode,
        dataObj.createdOnDate,
        dataObj.compAltName,
        dataObj.mainPhone,
        dataObj.mainAddress1,
        dataObj.mainAddress2,
        dataObj.mainCity,
        dataObj.mainState,
        dataObj.mainZip,
        dataObj.primContactName,
        dataObj.primContactTitle,
        dataObj.primContactCell,
        dataObj.primContactEmail,
        dataObj.billCompanyName,
        dataObj.billAddress1,
        dataObj.billAddress2,
        dataObj.billCity,
        dataObj.billState,
        dataObj.billZip,
        dataObj.billInvComment,
        dataObj.billContactName,
        dataObj.billContactCell,
        dataObj.billContactEmail,
        dataObj.addContactName0,
        dataObj.addContactCell0,
        dataObj.addContactEmail0,
        dataObj.addContactReason0,
        dataObj.addContactName1,
        dataObj.addContactCell1,
        dataObj.addContactEmail1,
        dataObj.addContactReason1,
        dataObj.addContactName2,
        dataObj.addContactCell2,
        dataObj.addContactEmail2,
        dataObj.addContactReason2                                     
    ];

    let appendage_labQuotes = [
        dataObj.compName,
        dataObj.createdOnDate,
        dataObj.labTestQuote01,
        dataObj.labTestQuote02,
        dataObj.labTestQuote03,
        dataObj.labTestQuote04,
        dataObj.labTestQuote05,
        dataObj.labTestQuote06,
        dataObj.labTestQuote07,
        dataObj.labTestQuote08,
        dataObj.labTestQuote09,
        dataObj.labTestQuote10,
        dataObj.labTestQuote11,
        dataObj.labTestQuote12,
        dataObj.labTestQuote13,
        dataObj.labTestQuote14,
        dataObj.labTestQuote15,
        dataObj.labTestQuote16,
        dataObj.labTestQuote17,
        dataObj.labTestQuote18,
        dataObj.labTestQuote19,
        dataObj.labTestQuote20,
        dataObj.labTestQuote21,
        dataObj.labTestQuote22,
        dataObj.labTestQuote23
    ];

    let filteredAppendage = appendage_labQuotes.filter(function (quote) {
        return quote !== ''
    })

    let appendage_masterNameList = [,
        dataObj.compName,
        dataObj.compCode
    ];


//only one quote per customer
    try {
        let customerQuotes = labBilling.getSheetByName('labQuotes').createTextFinder(dataObj.compCode).matchEntireCell(true).findNext();
        if (filteredAppendage.length >= 0) {
            if (customerQuotes) {
                let quoteRow = customerQuotes.getRow();
                labQuotesTab.deleteRow(quoteRow);
            }
            labQuotesTab.appendRow(appendage_labQuotes);
        }
    } catch (err) {
        return 'Error adding customer to Smith: ' + err;
    };

    try {
        masterListTab.appendRow(appendage_masterNameList);
        let lastRow = masterListTab.getLastRow();
        masterListTab.getRange(lastRow, 1).insertCheckboxes();
        //sort the list alphabetically after each addition
        let sortRange = masterListTab.getRange(2, 1, lastRow, 3).sort(2);

    } catch (err) {
        return 'Error adding customer to Smith: ' + err;
    };

    try {
        companyDataTab.appendRow(appendage_compData);
        addCustomerDataObj = {};
        return 'Customer Added to Smith';

    } catch (err) {
        return 'Error adding customer to Smith: ' + err;
    };
};


//and now, upload the files
//maybe global variables will help ... you know, the way babies save marriages 

function uploadFiles(dataStuff, fileName, divId, companyName){

let mainSmithFolder = DriveApp.getFolderById(smithFolderId);

//first off, is there a folder for this company?

function createItAll(){
try{
    let companyFolderId = mainSmithFolder.createFolder(companyName).getId();
    let msaFolderId = DriveApp.getFolderById(companyFolderId).createFolder("MSA & Quote").getId();
    let insFolderId = DriveApp.getFolderById(companyFolderId).createFolder("Insurance Docs").getId();
    let miscFolderId = DriveApp.getFolderById(companyFolderId).createFolder("Misc Docs").getId();
    let poFolderId = DriveApp.getFolderById(companyFolderId).createFolder("POs").getId();
  
  return switchItUp(msaFolderId,insFolderId,miscFolderId,poFolderId)
  
  } catch(err){
    console.error(err);
    }
}

function findItAll(){
  try{  
      let companyFolderId = mainSmithFolder.getFoldersByName(companyName).next().getId();
      let msaFolderId = DriveApp.getFolderById(companyFolderId).getFoldersByName("MSA & Quote").next().getId();
      let insFolderId = DriveApp.getFolderById(companyFolderId).getFoldersByName("Insurance Docs").next().getId();
      let miscFolderId = DriveApp.getFolderById(companyFolderId).getFoldersByName("Misc Docs").next().getId();
      let poFolderId = DriveApp.getFolderById(companyFolderId).getFoldersByName("POs").next().getId();
      
      return switchItUp(msaFolderId,insFolderId,miscFolderId,poFolderId);
  } catch(err){
      console.error(err)
      }
};

function switchItUp(msaFolderId,insFolderId,miscFolderId,poFolderId){
  let folderName;
  switch (divId) {
  
  case 'attachMSAFile':
  case 'attachQuoteFile':
  folderName = DriveApp.getFolderById(msaFolderId);
  break;
  
  case 'attachCOIFile':
  folderName = DriveApp.getFolderById(insFolderId);
  break;
  
  case 'attachMiscFile':
  case 'attachNameChgFile':
  folderName = DriveApp.getFolderById(miscFolderId);
  break;
  
  case 'attachPOFile':
  folderName = DriveApp.getFolderById(poFolderId);
  break;
  }

  return finallyFinally(folderName);
};

function finallyFinally(folderName){
  if(dataStuff == null || fileName == null || divId == null) {
   return "knockItoff";
   }

    var contentType = dataStuff.substring(5, dataStuff.indexOf(';')),
      bytes = Utilities.base64Decode(dataStuff.substr(dataStuff.indexOf('base64,') + 7)),
      blob = Utilities.newBlob(bytes, contentType, fileName);

//feed our variable folderName to the function 
try {
folderName.createFile(blob);
return 'OK';

  } catch (err) {
    return err;
  }
  
}

try{
    let thisVariable = mainSmithFolder.getFoldersByName(companyName).hasNext();

    return thisVariable ? findItAll() : createItAll();
  } catch(err){
      console.error(err);
      return err;
}
};
