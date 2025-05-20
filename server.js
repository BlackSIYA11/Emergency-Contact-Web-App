// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log("✅ MongoDB connected");
    console.log("🗂 Using DB:", mongoose.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📄 Collections in this DB:", collections.map(c => c.name));
})
.catch(err => console.error("❌ Mongo error", err));

// Mongoose Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    relation: String,
    phone: String
});

// Explicitly name the collection 'contacts'
const Contact = mongoose.model('Contact', ContactSchema, 'contacts');

// Routes
app.post('/contacts', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: "Contact saved", contact });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get contacts Information
// server.js or your backend file
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find(); // Mongoose includes _id by default
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete contact by ID
app.delete('/contacts/:id', async (req, res) => {
    try {
        const result = await Contact.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted', deleted: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update contact by ID
app.put('/contacts/:id', async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({ message: 'Contact updated successfully', contact: updatedContact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
