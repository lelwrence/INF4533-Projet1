//katl01@uqo.ca

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

viewSection('intro');


function saveContact() {
    let frmID = document.getElementById("contactID").value;
    let frmShortName = document.getElementById("contactShortName").value;
    let frmLongName = document.getElementById("contactLongName").value; //document.forms["frmContacts"]["contactLongName"].value;

    if (frmShortName == "" || frmLongName == "") {
        alert("Erreur! Saisissez les données.");
    } else {
        let newID;
        if (frmID == "") {
            newID = ++counterContacts;
        } else {
            newID = frmID;
        }
    
        let frmNewContact = {
            "ID": newID,
            "shortName": frmShortName,
            "longName": frmLongName,
            "lastUpdate": new Date()
        };
    
        arrayContactsIndex = getArrayContactsIndexFromID(frmNewContact.ID);
    
        if (arrayContactsIndex == -1) {
            arrayContacts.push(frmNewContact);
        } else {
            arrayContacts[arrayContactsIndex] = frmNewContact;
        }
    
        fillContactForm("", "", "");
    }

    refreshContacts();
    refreshMsgContacts();
}

function getArrayContactsIndexFromID(newContactID) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].ID == newContactID) {
            return i;
        }
    }
    return -1;
}

function fillContactForm(ID, shortName, longName) {
    let frmContactID = document.getElementById("contactID");
    let frmContactShortName = document.getElementById("contactShortName");
    let frmContactLongName = document.getElementById("contactLongName"); //document.forms["frmContacts"]["contactLongName"]; 

    frmContactID.value = ID;
    frmContactShortName.value = shortName;
    frmContactLongName.value = longName;
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
        btnEdit.classList.add("button-margin");
        //btnEdit.onclick = function() {editContact(newContact.ID);}
        btnEdit.addEventListener("click", function() {
            editContact(newContact.ID);
        })
        cellModify.appendChild(btnEdit);

        var btnDelete = document.createElement("input");
        btnDelete.type = "button";
        //btnDelete.className = "btn";
        btnDelete.value = "Supprimer";
        btnDelete.id = "deleteContact" + newContact.ID;
        btnDelete.classList.add("button-margin");
        //btnDelete.onclick = function() {deleteContact(newContact.ID);}
        btnDelete.addEventListener("click", function() {
            deleteContact(newContact.ID);
        })
        cellModify.appendChild(btnDelete);
    }
}

function refreshContacts(searchCond) {
    var contactsTable = document.getElementById("tblContactsBody");
    contactsTable.innerHTML = "";

    if (arrayContacts.length === 0) {
        addContactTableRow();
    } else {
        for (var i = 0; i < arrayContacts.length; i++) {
            arrayContacts[i].lastUpdate = new Date(arrayContacts[i].lastUpdate);
            if (searchCond == undefined || JSON.stringify(arrayContacts[i]).includes(searchCond)) {
                addContactTableRow(arrayContacts[i]);
            }
        }
    }

    localStorage.setItem("arrayContacts", JSON.stringify(arrayContacts));
    localStorage.setItem("counterContacts", counterContacts);
}

function editContact(contactIDToEdit) {
    let contactToEdit;
    let frmContactID = document.getElementById(contactID);
    let frmContactShortName = document.getElementById(contactShortName);
    let frmContactLongName = document.getElementById(contactLongName);

    for (var i = 0; i < arrayContacts.length; i++) {
        if (contactIDToEdit == arrayContacts[i].ID) {
            contactToEdit = arrayContacts[i];
            fillContactForm(contactToEdit.ID, contactToEdit.shortName, contactToEdit.longName);
            break;
        }
    }

    refreshContacts();
}

function deleteContact(contactIDToDelete) {
    let countMsg = 0;
    for (var i = 0; i < arrayMsg.length; i++) {
        if (arrayMsg[i].contactID == contactIDToDelete) {
            countMsg++;
        }
    }

    if (countMsg !== 0) {
        alert("Impossible de supprimer. Contact #" + contactIDToDelete + " est utilisé.");
    } else {
        let contactToDelete;
        for (var i = 0; i < arrayContacts.length; i++) {
            if (contactIDToDelete == arrayContacts[i].ID) {
                contactToDelete = i;
                arrayContacts.splice(contactToDelete);
                break;
            }
        }
        refreshContacts();
    }    
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
    let frmMsgContact = document.getElementById("msgContact").value;
    let frmMsgSubject = document.getElementById("msgSubject").value;
    let frmMsgText = document.getElementById("msgText").value;

    if (frmMsgContact == "blankrow") {
        alert("Erreur! Choisissez un contact.");
    } else if (frmMsgSubject == "" || frmMsgText == "") { 
        alert("Erreur! Saisissez les données.");
    } else {
        let frmNewMsg = {
            "ID": ++counterMsg,
            "contactID": frmMsgContact,
            "subject": frmMsgSubject, 
            "message": frmMsgText,
            "lastUpdate": new Date()
        };
        arrayMsg.push(frmNewMsg);
        refreshMsg();
    }
}

function refreshMsg(searchCond) {
    let msgTable = document.getElementById("tblMsgBody");
    msgTable.innerHTML = "";

    if (arrayMsg.length === 0) {
        addMsgTableRow();
    } else {
        for (var i = 0; i < arrayMsg.length; i++) {
            arrayMsg[i].lastUpdate = new Date(arrayMsg[i].lastUpdate);
            let msgContact = getArrayContactsIndexFromID(arrayMsg[i].contactID);
            let searchMsgAndContact = JSON.stringify(arrayMsg[i]) + JSON.stringify(arrayContacts[msgContact]);
            if (searchCond == undefined || searchMsgAndContact.includes(searchCond)) {
                addMsgTableRow(arrayMsg[i]);
            }
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
    var cellSubject = newRow.insertCell(2);
    var cellMessage = newRow.insertCell(3);
    var cellLastUpdate = newRow.insertCell(4);

    cellSubject.classList.add("tdbreak");

    if (newMsg == undefined) {
        cellSubject.innerHTML = "Aucun message";
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
        cellSubject.innerHTML = newMsg.subject;
        cellMessage.innerHTML = newMsg.message.replace(/\n/g,"<br>");
    
        //let lastUpdate = Date.parse(lastUpdate);
        var offset = newMsg.lastUpdate.getTimezoneOffset();
        var lastUpdate = new Date(newMsg.lastUpdate.getTime() - (offset * 60 * 1000));
        cellLastUpdate.innerHTML = lastUpdate.toISOString().replace("T"," ").substring(0,16).replace(":", " h ");
    }
}

function viewSection(sectionID) {
    let sections = document.getElementsByClassName("nav-section");

    for (var i = 0; i < sections.length; i++) {
        if (sections[i].id == sectionID && sections[i].classList.contains("hidden")) {
            sections[i].classList.remove("hidden");
        }
        if (sections[i].id !== sectionID && !sections[i].classList.contains("hidden")) {
            sections[i].classList.add("hidden");
        }
    }
}