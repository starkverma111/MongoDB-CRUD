const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Initialize app here

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://ruhi210singh:1234567890@mcrud.gv9mz.mongodb.net/?retryWrites=true&w=majority&appName=mcrud';

// MongoDB connection
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

// Define a schema and model
const DataSchema = new mongoose.Schema({
    name: String,
    city: String
});

const DataModel = mongoose.model('my-profile', DataSchema);

// Endpoint to insert data
app.post('/insert', async (req, res) => {
    try {
        const newData = new DataModel({
            name: req.body.name,
            city: req.body.city
        });
        await newData.save();
        res.status(201).json({ message: 'Data inserted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error inserting data', error });
    }
});

// Endpoint to fetch all data
app.get('/fetch', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// Endpoint to update data by ID
app.put('/update/:id', async (req, res) => {
    try {
        const updatedData = await DataModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            city: req.body.city
        }, { new: true });
        
        if (!updatedData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data updated successfully', updatedData });
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error });
    }
});

// Endpoint to delete data by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const deletedData = await DataModel.findByIdAndDelete(req.params.id);
        
        if (!deletedData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
