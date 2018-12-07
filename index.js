const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const wpn = require('./wiringPiNode'); // for now assume it is in main dir
const gpioLed = wpn.gpioLed();
const joystick = wpn.joystick();
const buzzer = wpn.buzzer();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  pingTimeout: 500,
  pingInterval: 1000,
});

io.on('connection', (socket) => {
  // console.log('a user connected');

  socket.on('gpioLed', (data) => {
    // led modification
    if (data) {
      if (typeof data.value == 'boolean') {
        if (data.value) {
          gpioLed.on();
        } else {
          gpioLed.off();
        }
      } else {
        socket.emit('gpioLed', { success: false, errorMsg: 'invalid data format' });
      }
      // emit to all
      io.emit('gpioLed', { success: true, value: gpioLed.isOn() });
    // only read
    } else {
      socket.emit('gpioLed', { success: true, value: gpioLed.isOn() });
    }
  });

  socket.on('buzzer', (data) => {
     // buzzer modification
     if (data) {
      if (typeof data.value == 'boolean') {
        console.log('switching buzzer to: ' + data.value.toString())
        if (data.value) {
          buzzer.on();
        } else {
          buzzer.off();
        }
      } else {
        socket.emit('buzzer', { success: false, errorMsg: 'invalid data format' });
      }
      // emit to all
      const newState = buzzer.isOn();
      console.log('emit to all: ' + newState.toString());
      io.emit('buzzer', { success: true, value: newState });
    // only read
    } else {
      socket.emit('buzzer', { success: true, value: buzzer.isOn() });
    }
  });

  // socket.on('disconnect', () => {
  //   console.log('a user disconnected');
  // })
});

joystick.watch(() => {
  const newValue = !gpioLed.isOn();
  if (newValue) {
    gpioLed.on();
  } else {
    gpioLed.off();
  }
  // emit to all
  io.emit('gpioLed', { success: true, value: gpioLed.isOn() });
}, () => {
  const newValue = !buzzer.isOn();
  if (newValue) {
    buzzer.on();
  } else {
    buzzer.off();
  }
  // emit to all
  io.emit('buzzer', { success: true, value: buzzer.isOn() });
});

app.use(bodyParser.json());
app.use(morgan('[:date[web]] ":method :url :response-time ms :remote-addr :status'));
app.use(express.static(
  './dist',
  {
    setHeaders: (res, path, stat) => {
      res.set('Cache-Control', 'no-cache');
    }
  }
));

server.listen(3000, () => {
  console.log("Server started!");
});


// app.get('/gpioLed', (req, res, next) => {
//   res.set('Content-Type', 'application/json');

//   try {
//     const isOn = gpioLed.isOn();

//     res.send(JSON.stringify({ success: true, value: gpioLed.isOn() }));
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false });
//   } finally {
//     res.end();
//   }
// });

// app.put('/gpioLed', (req, res, next) => {
//   res.set('Content-Type', 'application/json');
//   try {
//     const newValue = req.body.value;
//     let success = false;
//     if (typeof newValue == 'boolean') {
//       if (newValue) {
//         gpioLed.on();
//       } else {
//         gpioLed.off();
//       }
//       success = true;
//     }
//     res.json({ success, value: gpioLed.isOn() });
//   } catch (e) {
//     console.error(e);
//   } finally {
//     res.end();
//   }
// });

// app.listen(3000, () => {
//   console.log("Server started");
// });
