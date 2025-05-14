let contacts = [];
let editIndex = -1; // -1 means not editing

// __define-ocg__
function addContact() {
    const name = document.getElementById("name").value.trim();
    const relation = document.getElementById("relation").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !relation || !phone) {
        alert("Please fill out all fields.");
        return;
    }

    // Validate phone number format: +27 followed by 9 digits
    const phonePattern = /^\+27\d{9}$/;
    if (!phonePattern.test(phone)) {
        alert("Phone number must start with +27 and be followed by 9 digits (e.g., +27123456789)");
        return;
    }

    const contact = { name, relation, phone };

    fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
    .then(res => res.json())
    .then(data => {
        alert("Contact saved to database!");
        clearForm();
        fetchContacts(); // Refresh list from DB
    })
    .catch(err => console.error('Error saving contact:', err));
}


function fetchContacts() {
    fetch('http://localhost:3000/contacts')
        .then(res => res.json())
        .then(data => {
            console.log("Fetched contacts:", data); // This fetches the contacts
            contacts = data;
            displayContacts();
        })
        .catch(err => console.error('Error fetching contacts:', err));
}


// Display contact list
function displayContacts() {
    const list = document.getElementById("contacts-list");
    list.style.display = 'block';
    list.innerHTML = '';

    if (contacts.length === 0) {
        list.innerHTML = '<li>No contacts added yet.</li>';
        return;
    }

    contacts.forEach((c, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${c.name}</strong> (${c.relation}): ${c.phone}
            <button onclick="editContact(${index})">✏️ Edit</button>
            <button onclick="deleteContact(${index})">🗑️ Delete</button>
        `;
        list.appendChild(li);
    });
}

// Edit contact
function editContact(index) {
    const contact = contacts[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("relation").value = contact.relation;
    document.getElementById("phone").value = contact.phone;

    editIndex = index;
    document.getElementById("add-btn").textContent = "✅ Update Contact";
}

// Delete contact
function deleteContact(index) {
    const contactId = contacts[index]._id;

    if (confirm("Are you sure you want to delete this contact?")) {
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            fetchContacts(); // Refresh the contact list
        })
        .catch(err => console.error('Error deleting contact:', err));
    }
}


// Clear form
function clearForm() {
    document.getElementById("name").value = '';
    document.getElementById("relation").value = '';
    document.getElementById("phone").value = '';
}

// Hide contact list
function closeContacts() {
    document.getElementById("contacts-list").style.display = 'none';
}

// Panic button
function sendPanic() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            position => {
                alert(`🚨 Panic alert sent!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
            },
            () => {
                alert("Unable to get location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// Event listeners
document.getElementById("add-btn").addEventListener("click", addContact);
document.getElementById("display-btn").addEventListener("click", displayContacts);
document.getElementById("close-btn").addEventListener("click", closeContacts);
