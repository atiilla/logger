const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://linux:pSMBlopL5M0UbHag@webdevfeb.o9i0jwh.mongodb.net/logger?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// logSchema
const logSchema = new mongoose.Schema({
    date: Date,
    ip: String,
    usergent: String,
});

// logModel
const logModel = mongoose.model('log', logSchema);

app.use(cors());

// Custom middleware to log image file requests
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    let remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logObj = {
        date: new Date(),
        ip: remoteIp,
        usergent: req.headers['user-agent'],
        cookie: req.cookies['dotcom_user'],
    }
    console.log(logObj);
    const log = new logModel(logObj);
    log.save();
  }
  next();
});

// Logging middleware setup with custom format
// app.use(morgan('combined'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});