class Contact {
    
    constructor(shortName, longName) {
        this.shortName = shortName;
        this.longName = longName;
        //this.key = "";
        this.lastUpdate = Date(Date.now());
    }
}

class Message {
    constructor(contactId, subject, message) {
        this.contactId = contactId;
        this.subject = subject;
        this.message = message;
        this.lastUpdate = Date(Date.now());
    }
}

var arrayContacts = [];
if (localStorage.getItem("arrayContacts") === null) {
    localStorage.setItem("arrayContacts", arrayContacts);
} else {
    var arrayContacts2 = localStorage.getItem("arrayContacts");
    arrayContacts2 = Object.values(arrayContacts2);
}

function isExistingContact(newContact) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].shortName === newContact.shortName) {
            return i;
        }
    }
    return -1;
}

function saveContact() {
    let frmShortName = document.forms["frmContacts"]["contactShortName"].value;
    let frmLongName = document.getElementById("contactLongName").value; //document.forms["frmContacts"]["contactLongName"].value;

    //alert(document.getElementById("contactShortName").value);

    let frmNewContact = new Contact(frmShortName, frmLongName);
    console.log(frmNewContact);

    isExisting = isExistingContact(frmNewContact);

    if (isExisting == -1) {
        arrayContacts.push(frmNewContact);
    } else {
        arrayContacts[isExisting] = frmNewContact;
    }

    localStorage.setItem("arrayContacts", JSON.stringify(arrayContacts));

    refreshContactsTable();
}

function addContactTableRow(ID, shortName, longName, lastUpdate) {
    var tbodyRef = document.getElementById('tblContacts').getElementsByTagName('tbody')[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellShortName = newRow.insertCell(1);
    var cellLongName = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);
    cellID.innerHTML = ID;
    cellShortName.innerHTML = shortName;
    cellLongName.innerHTML = longName;

    lastUpdate = Date.parse(lastUpdate);
    //const offset = lastUpdate.getTimezoneOffset();
    //lastUpdate = new Date(lastUpdate.getTime() - (offset*60*1000));

    cellLastUpdate.innerHTML = lastUpdate //.toISOString().split('T')[0];
}

function refreshContactsTable() {
    document.getElementById('tblContactsBody').innerHTML = "";
    if (arrayContacts.length === 0) {
        addContactTableRow("", "Aucun record", "", "");
    } else {
        for (var i = 0; i < arrayContacts.length; i++) {
            addContactTableRow(i, arrayContacts[i].shortName, arrayContacts[i].longName, arrayContacts[i].lastUpdate);
        }
    }
}