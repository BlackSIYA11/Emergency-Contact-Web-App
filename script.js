let contacts = [];
let editIndex = -1;
let varOcg = {}; // __define-ocg__

document.getElementById("name").addEventListener("input", checkChanges);
document.getElementById("relation").addEventListener("input", checkChanges);
document.getElementById("phone").addEventListener("input", checkChanges);

function addContact() {
    const name = document.getElementById("name").value.trim();
    const relation = document.getElementById("relation").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !relation || !phone) {
        alert("Please fill out all fields.");
        return;
    }

    const phonePattern = /^\+27\d{9}$/;
    if (!phonePattern.test(phone)) {
        alert("Phone number must start with +27 and be followed by 9 digits.");
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
    })
    .catch(err => console.error('Error saving contact:', err));
}

function updateContact() {
    const name = document.getElementById("name").value.trim();
    const relation = document.getElementById("relation").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !relation || !phone) {
        alert("Please fill out all fields.");
        return;
    }

    const phonePattern = /^\+27\d{9}$/;
    if (!phonePattern.test(phone)) {
        alert("Phone number must start with +27 and be followed by 9 digits.");
        return;
    }

    const original = varOcg;
    if (name === original.name && relation === original.relation && phone === original.phone) {
        alert("No changes detected.");
        return;
    }

    const contact = { name, relation, phone };
    const contactId = contacts[editIndex]._id;

    fetch(`http://localhost:3000/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
    .then(res => res.json())
    .then(data => {
        alert("Contact updated successfully!");
        editIndex = -1;
        clearForm();
        fetchContacts();
    })
    .catch(err => console.error('Error updating contact:', err));
}

function fetchContacts(callback) {
    fetch('http://localhost:3000/contacts')
        .then(res => res.json())
        .then(data => {
            contacts = data;
            if (callback) callback(); // Call displayContacts only when fetch is done
        })
        .catch(err => console.error('Error fetching contacts:', err));
}


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

function editContact(index) {
    const contact = contacts[index];
    document.getElementById("name").value = contact.name;
    document.getElementById("relation").value = contact.relation;
    document.getElementById("phone").value = contact.phone;

    editIndex = index;
    varOcg = { ...contact };

    // Show Update button and disable until changes
    const updateBtn = document.getElementById("update-btn");
    updateBtn.hidden = false;
    updateBtn.disabled = true;

    checkChanges();
}

function deleteContact(index) {
    const contactId = contacts[index]._id;

    if (confirm("Are you sure you want to delete this contact?")) {
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            fetchContacts();
        })
        .catch(err => console.error('Error deleting contact:', err));
    }
}

function clearForm() {
    document.getElementById("name").value = '';
    document.getElementById("relation").value = '';
    document.getElementById("phone").value = '';
    document.getElementById("add-btn").textContent = "➕ Add Contact";

    editIndex = -1;
    varOcg = {};

    const updateBtn = document.getElementById("update-btn");
    updateBtn.hidden = true;
    updateBtn.disabled = true;

    checkChanges();
}

function closeContacts() {
    document.getElementById("contacts-list").style.display = 'none';
}

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

function checkChanges() {
    const name = document.getElementById("name").value.trim();
    const relation = document.getElementById("relation").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const filled = name && relation && phone;
    document.getElementById("add-btn").disabled = !filled;

    const updateBtn = document.getElementById("update-btn");

    if (editIndex === -1) {
        updateBtn.hidden = true;
        updateBtn.disabled = true;
        return;
    }

    const changed = name !== varOcg.name || relation !== varOcg.relation || phone !== varOcg.phone;
    updateBtn.disabled = !changed;
}

// Event listeners
document.getElementById("add-btn").addEventListener("click", addContact);
document.getElementById("update-btn").addEventListener("click", updateContact);
document.getElementById("display-btn").addEventListener("click", () => {
    fetchContacts(displayContacts);
});
document.getElementById("refresh-btn").addEventListener("click", () => {
    const refreshBtn = document.getElementById("refresh-btn");
    refreshBtn.textContent = "🔁 Refreshing...";
    fetchContacts(() => {
        displayContacts();
        refreshBtn.textContent = "🔁 Refresh Contacts";
    });
});


document.getElementById("close-btn").addEventListener("click", closeContacts);

// Initial state
document.getElementById("add-btn").disabled = true;
document.getElementById("update-btn").hidden = true;
