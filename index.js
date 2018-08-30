const express = require('express');
const morgan = require('morgan');

const wpn = require('wiring-pi-node');
const gpioLed = wpn.gpioLed();

const app = express();
app.use(morgan('[:date[web]] ":method :url :response-time ms'));
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
    if (isOn) {
      gpioLed.off();
    } else {
      gpioLed.on();
    }

    res.send(JSON.stringify({ success: true, value: gpioLed.isOn() }));

  } catch (err) {

    console.error(err);
    res.json({ success: false });

  } finally {
    res.end();
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
