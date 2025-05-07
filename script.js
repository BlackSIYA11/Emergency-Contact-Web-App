let contacts = [];

function addContact() {
    const name = document.getElementById("name").value;
    const relation = document.getElementById("relation").value;
    const phone = document.getElementById("phone").value;

    const contact = { name, relation, phone };
    contacts.push(contact);
    displayContacts();
}

function displayContacts() {
    const list = document.getElementById("contacts-list");
    list.innerHTML = '';
    contacts.forEach((c, i) => {
        list.innerHTML += `<li>${c.name} (${c.relation}): ${c.phone}</li>`;
    });
}

function sendPanic() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            alert(`Panic alert sent!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
            // You could send this via an API to notify contacts via Twilio or SendGrid
        });
    } else {
        alert("Geolocation not supported.");
    }
}
