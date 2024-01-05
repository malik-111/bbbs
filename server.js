const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Add this line

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'bbbs', 'public')));


// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB URL)
mongoose.connect('mongodb+srv://malik111:Salford7890!@bbbs.qnwcjlr.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const slotSchema = new mongoose.Schema({
    slotKey: String,
    isBooked: Boolean,
});

const Slot = mongoose.model('Slot', slotSchema);

app.get('/api/bookedSlots', async (req, res) => {
    try {
        const bookedSlots = await Slot.find();
        console.log('Booked Slots:', bookedSlots); // Add this line for logging
        res.json(bookedSlots);
    } catch (error) {
        console.error('Error fetching booked slots:', error); // Add this line for logging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/bookedSlots', async (req, res) => {
    const { slotKey, isBooked } = req.body;

    try {
        const existingSlot = await Slot.findOne({ slotKey });

        if (existingSlot) {
            existingSlot.isBooked = isBooked;
            await existingSlot.save();
        } else {
            await Slot.create({ slotKey, isBooked });
        }

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// All other routes will be handled by serving 'index.html'
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
