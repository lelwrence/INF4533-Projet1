class Contact {
    constructor(shortName, longName) {
        this.shortName = shortName;
        this.longName = longName;
        key = "";
        lastUpdate = Date(Date.now());
    }

}

class Message {
    constructor(contactId, subject, message) {
        this.contactId = contactId;
        this.subject = subject;
        this.message = message;
        lastUpdate = Date(Date.now());
    }
}

var arrayContacts = [];
localStorage.setItem("arrayContacts", arrayContacts);

function isExistingContact(newContact) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].shortName === newContact.shortName) {
            return i;
        }
        return -1;
    }
}

function saveContact() {
    let frmShortName = document.forms["frmContacts"]["contactShortName"].value;
    let frmLongName = document.forms["frmContacts"]["contactLongName"].value;
    let frmNewContact = new Contact(frmShortName, frmLongName);
    console.log(frmNewContact);

    isExisting = isExistingContact(frmNewContact);

    if (isExisting == -1) {
        arrayContacts.push(frmNewContact);
    } else {
        arrayContacts[isExisting] = frmNewContact;
    }

    localStorage.setItem("arrayContacts", arrayContacts);
}