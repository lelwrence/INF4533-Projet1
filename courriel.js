class Contact {
    
    constructor(shortName, longName) {
        this.shortName = shortName;
        this.longName = longName;
        //this.key = "";
        this.lastUpdate = new Date();
    }
}

class Message {
    constructor(contactId, subject, message) {
        this.contactId = contactId;
        this.subject = subject;
        this.message = message;
        this.lastUpdate = new Date();
    }
}

var arrayContacts = [];
//refreshContactsTable();
refreshMsgContacts();

/* //fix this
if (localStorage.getItem("arrayContacts") === null) {
    localStorage.setItem("arrayContacts", arrayContacts);
} else {
    var arrayContacts2 = localStorage.getItem("arrayContacts");
    arrayContacts2 = Object.values(arrayContacts2);
}
*/

function isExistingContact(newContact) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].shortName === newContact.shortName) {
            return i;
        }
    }
    return -1;
}

function saveContact() {
    let frmShortName = document.getElementById("contactShortName").value; //document.forms["frmContacts"]["contactShortName"].value;
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
    refreshMsgContacts();
}

function editContact() {

}

function deleteContact() {
    
}

function addContactTableRow() {
    var tbodyRef = document.getElementById("tblContacts").getElementsByTagName("tbody")[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellShortName = newRow.insertCell(1);
    var cellLongName = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);
    cellLongName.innerHTML = "Aucun record";
}

function addContactTableRow(ID, newContact) {
    var tbodyRef = document.getElementById("tblContacts").getElementsByTagName("tbody")[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellShortName = newRow.insertCell(1);
    var cellLongName = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);
    cellID.innerHTML = ID;
    cellShortName.innerHTML = newContact.shortName;
    cellLongName.innerHTML = newContact.longName;

    //lastUpdate = Date.parse(lastUpdate);
    var offset = newContact.lastUpdate.getTimezoneOffset();
    var lastUpdate = new Date(newContact.lastUpdate.getTime() - (offset*60*1000));

    cellLastUpdate.innerHTML = lastUpdate.toISOString(); //.split('T')[0];
}

function refreshContactsTable() {
    var contactsTable = document.getElementById("tblContactsBody");
    contactsTable.innerHTML = "";

    if (arrayContacts.length === 0) {
        addContactTableRow();
    } else {
        for (var i = 0; i < arrayContacts.length; i++) {
            addContactTableRow(i, arrayContacts[i]);
        }
    }
}

function refreshMsgContacts() {
    var msgContact = document.getElementById("msgContact");
    msgContact.innerHTML = "";
    console.log(arrayContacts.length);
    for (var i = -1; i < arrayContacts.length; i++) {
        var opt = document.createElement("option");
        if (i == -1) {
            if (arrayContacts.length === 0) {
                opt.textValue = "Aucun contact";
            } else {
                opt.textValue = "Choisir contact";
            }
            opt.value = "0";
        } else {
            opt.textValue = arrayContacts[i].longName;
            opt.value = arrayContacts[i].shortName;
        }
        msgContact.appendChild(opt);
        console.log(opt);
    }

}