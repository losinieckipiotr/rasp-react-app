const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const wpn = require('./wiringPiNode'); // for now assume it is in main dir
const gpioLed = wpn.gpioLed();

const app = express();
app.use(bodyParser.json());
app.use(morgan('[:date[web]] ":method :url :response-time ms :remote-addr :status'));
app.use(express.static('./dist',
  {
    setHeaders: (res, path, stat) => {
      res.set('Cache-Control', 'no-cache');
    }
  }
));

app.get('/gpioLed', (req, res, next) => {
  res.set('Content-Type', 'application/json');

  try {
    const isOn = gpioLed.isOn();

    res.send(JSON.stringify({ success: true, value: gpioLed.isOn() }));
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  } finally {
    res.end();
  }
});

app.put('/gpioLed', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  try {
    const newValue = req.body.value;
    let success = false;
    if (typeof newValue == 'boolean') {
      if (newValue) {
        gpioLed.on();
      } else {
        gpioLed.off();
      }
      success = true;
    }
    res.json({ success, value: gpioLed.isOn() });
  } catch (e) {
    console.error(e);
  } finally {
    res.end();
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
