const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());

const getLogs = () => {
  try {
    const data = fs.readFileSync('./public/log.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const setLogs = (data) => {
  try {
    const existingData = getLogs();
    existingData.push(data);
    fs.writeFileSync('./public/log.json', JSON.stringify(existingData));
    console.log('The file has been saved!');
  } catch (err) {
    console.error(err);
  }
};

app.use((req, res, next) => {
  const ext = path.extname(req.url);
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    let remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logObj = {
      date: new Date(),
      ip: remoteIp,
      usergent: req.headers['user-agent'],
    };
    console.log(logObj);
    setLogs(logObj);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
