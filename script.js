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

    const varOcg = { name, relation, phone };

    if (editIndex === -1) {
        contacts.push(varOcg); // Add new
        alert("Contact added successfully!");
    } else {
        contacts[editIndex] = varOcg; // Edit existing
        editIndex = -1;
        alert("Contact updated!");
        document.getElementById("add-btn").textContent = "➕ Add Contact";
    }

    clearForm();
    displayContacts();
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
    if (confirm("Are you sure you want to delete this contact?")) {
        contacts.splice(index, 1);
        displayContacts();
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
        navigator.geolocation.getCurrentPosition(position => {
            alert(`🚨 Panic alert sent!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
            // Send info via API to alert contacts
        }, () => {
            alert("Unable to get location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event listeners
document.getElementById("add-btn").addEventListener("click", addContact);
document.getElementById("display-btn").addEventListener("click", displayContacts);
document.getElementById("close-btn").addEventListener("click", closeContacts);
