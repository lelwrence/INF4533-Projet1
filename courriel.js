let arrayContacts = [];
let arrayMsg = [];
let counterContacts;
let counterMsg;

//get data from localstorage or create if not exists
if (localStorage.getItem("counterContacts") == null) {
    counterContacts = 0;
    localStorage.setItem("counterContacts", counterContacts);
} else {
    counterContacts = localStorage.getItem("counterContacts");
}

if (localStorage.getItem("counterMsg") == null) {
    counterMsg = 0;
    localStorage.setItem("counterMsg", counterMsg);
} else {
    counterMsg = localStorage.getItem("counterMsg");
}

if (localStorage.getItem("arrayContacts") == "" || localStorage.getItem("arrayContacts") == null) {
    localStorage.setItem("arrayContacts", arrayContacts);
} else {
    arrayContacts = JSON.parse(localStorage.getItem("arrayContacts"));
}

if (localStorage.getItem("arrayMsg") == "" || localStorage.getItem("arrayMsg") == null) {
    localStorage.setItem("arrayMsg", arrayMsg);
} else {
    arrayMsg = JSON.parse(localStorage.getItem("arrayMsg"));
}

//refresh views after retrieving from localstorage
refreshContacts();
refreshMsgContacts();
refreshMsg();


function saveContact() {
    let frmShortName = document.getElementById("contactShortName").value; //document.forms["frmContacts"]["contactShortName"].value;
    let frmLongName = document.getElementById("contactLongName").value; //document.forms["frmContacts"]["contactLongName"].value;

    //alert(document.getElementById("contactShortName").value);

    //let frmNewContact = new Contact(frmShortName, frmLongName);
    let frmNewContact = {
        "ID": ++counterContacts,
        "shortName": frmShortName,
        "longName": frmLongName,
        "lastUpdate": new Date()
    };
    console.log(frmNewContact);

    arrayContactsIndex = isExistingContact(frmNewContact); //returns -1 if not exists, else returns index in arrayContacts

    if (arrayContactsIndex == -1) {
        arrayContacts.push(frmNewContact);
    } else {
        arrayContacts[arrayContactsIndex] = frmNewContact;
    }

    refreshContacts();
    refreshMsgContacts();
}

function isExistingContact(newContact) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].ID === newContact.ID) {
            return i;
        }
    }
    return -1;
}

function addContactTableRow(newContact) {
    var tbodyRef = document.getElementById("tblContacts").getElementsByTagName("tbody")[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellShortName = newRow.insertCell(1);
    var cellLongName = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);
    var cellModify = newRow.insertCell(4);

    if (newContact == undefined) {
        cellLongName.innerHTML = "Aucun record";
    } else {
        cellID.innerHTML = newContact.ID;
        cellShortName.innerHTML = newContact.shortName;
        cellLongName.innerHTML = newContact.longName;
    
        //let lastUpdate = Date.parse(lastUpdate);
        var offset = newContact.lastUpdate.getTimezoneOffset();
        var lastUpdate = new Date(newContact.lastUpdate.getTime() - (offset * 60 * 1000));
        cellLastUpdate.innerHTML = lastUpdate.toISOString().replace("T"," ").substring(0,16).replace(":", " h ");

        var btnEdit = document.createElement("input");
        btnEdit.type = "submit";
        //btnEdit.className = "btn";
        btnEdit.value = "Modifier";
        btnEdit.id = "editContact" + newContact.ID;
        //btnEdit.onclick = function() {editContact(newContact.ID);}
        btnEdit.addEventListener("click", function() {
            alert("button clicked");
            editContact(newContact.ID);
        })
        cellModify.appendChild(btnEdit);

        var btnDelete = document.createElement("input");
        btnDelete.type = "button";
        //btnDelete.className = "btn";
        btnDelete.value = "Supprimer";
        btnDelete.id = "deleteContact" + newContact.ID;
        btnDelete.onclick = function() {deleteContact(newContact.ID);}
        cellModify.appendChild(btnDelete);
    }
}

function refreshContacts() {
    var contactsTable = document.getElementById("tblContactsBody");
    contactsTable.innerHTML = "";

    if (arrayContacts.length === 0) {
        addContactTableRow();
    } else {
        for (var i = 0; i < arrayContacts.length; i++) {
            arrayContacts[i].lastUpdate = new Date(arrayContacts[i].lastUpdate);
            addContactTableRow(arrayContacts[i]);
        }
    }

    localStorage.setItem("arrayContacts", JSON.stringify(arrayContacts));
    localStorage.setItem("counterContacts", counterContacts);
}

function editContact(contactIDToEdit) {
    console.log(contactIDToEdit);
    let contactToEdit;
    let frmContactID = document.getElementById(contactID);
    let frmContactShortName = document.getElementById(contactShortName);
    let frmContactLongName = document.getElementById(contactLongName);

    for (var i = 0; i < arrayContacts; i++) {
        if (contactIDToEdit == arrayContacts[i].ID) {
            contactToEdit = arrayContacts[i];
            frmContactID.value = contactToEdit.ID;
            frmContactShortName.value = contactToEdit.shortName;
            frmContactLongName.value = contactToEdit.longName;
            break;
        }
    }
}

function deleteContact(contactIDToDelete) {
    console.log(contactIDToDelete);
    let contactToDelete;
    for (var i = 0; i < arrayContacts; i++) {
        if (contactIDToDelete == arrayContacts[i].ID) {
            contactToDelete = i;
            break;
        }
    }
    arrayContacts.splice(contactToDelete);
}

function refreshMsgContacts() {
    var msgContact = document.getElementById("msgContact");
    msgContact.innerHTML = "";
    for (var i = -1; i < arrayContacts.length; i++) {
        var opt = document.createElement("option");
        if (i == -1) {
            if (arrayContacts.length === 0) {
                opt.innerText = "Aucun contact";
            } else {
                opt.innerText = "Choisir contact";
            }
            opt.value = "blankrow";
        } else {
            opt.innerText = arrayContacts[i].longName;
            opt.value = arrayContacts[i].ID;
            opt.name = arrayContacts[i].shortName;
        }
        msgContact.appendChild(opt);
    }

}

function sendMsg() {
    let frmMsgContact = document.getElementById("msgContact");
    let frmMsgSubject = document.getElementById("msgSubject");
    let frmMsgText = document.getElementById("msgText");

    if (frmMsgContact.value == "blankrow") {
        alert("Erreur! Choisissez un contact.");
    } else {
        /*
        let msgContact;
        for (var i = 0; i < arrayContacts.length; i++) {
            if (arrayContacts[i].ID === frmMsgContact.value) {
                msgContact = arrayContacts[i];
                break;
            }
        }
        */
    
        let frmNewMsg = {
            "ID": ++counterMsg,
            "contactID": frmMsgContact.value,
            //"contactShortName": msgContact.shortName,
            //"contactLongName": msgContact.longName,
            "subject": frmMsgSubject.value,
            "message": frmMsgText.value,
            "lastUpdate": new Date()
        };
        arrayMsg.push(frmNewMsg);
        refreshMsg();
    }
}

function refreshMsg() {
    let msgTable = document.getElementById("tblMsgBody");
    msgTable.innerHTML = "";

    if (arrayMsg.length === 0) {
        addMsgTableRow();
    } else {
        for (var i = 0; i < arrayMsg.length; i++) {
            arrayMsg[i].lastUpdate = new Date(arrayMsg[i].lastUpdate);
            addMsgTableRow(arrayMsg[i]);
        }
    }

    localStorage.setItem("arrayMsg", JSON.stringify(arrayMsg));
    localStorage.setItem("counterMsg", counterMsg);
}

function addMsgTableRow(newMsg) {
    var tbodyRef = document.getElementById("tblMsg").getElementsByTagName("tbody")[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellRecipient = newRow.insertCell(1);
    var cellMessage = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);

    if (newMsg == undefined) {
        cellMessage.innerHTML = "Aucun message";
    } else {
        let msgContact;
        for (var i = 0; i < arrayContacts.length; i++) {
            if (arrayContacts[i].ID == newMsg.contactID) {
                msgContact = arrayContacts[i];
                break;
            }
        }

        cellID.innerHTML = newMsg.ID;
        cellRecipient.innerHTML = msgContact.longName;
        cellMessage.innerHTML = newMsg.message.replace(/\n/g,"<br>");
    
        //let lastUpdate = Date.parse(lastUpdate);
        var offset = newMsg.lastUpdate.getTimezoneOffset();
        var lastUpdate = new Date(newMsg.lastUpdate.getTime() - (offset * 60 * 1000));
        cellLastUpdate.innerHTML = lastUpdate.toISOString().replace("T"," ").substring(0,16).replace(":", " h ");
    }
}
