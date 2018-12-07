import * as React from 'react';
import { getSocket } from './Socket';

interface HeaderState {
  delay: string;
  led?: boolean;
  buzzer?: boolean;
}

let start = Date.now();

export class Header extends React.Component<{}, HeaderState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      delay: '',
      led: undefined,
      buzzer: undefined,
    };
  }

  public componentDidMount() {
    const socket = getSocket();
    socket.on('gpioLed', this.updateLED);
    socket.on('buzzer', this.updateBuzzer);

    start = Date.now();
    socket.emit('gpioLed');
    socket.emit('buzzer');
  }

  public render() {
    const {
      delay,
      led,
      buzzer,
    } = this.state;

    if (led === undefined || buzzer === undefined) { return null; }

    const ledButtonClass = led ? 'w3-red' : 'w3-black';
    const buzzerButtonClass = buzzer ? 'w3-red' : 'w3-black';

    return (
      <div style={{display: 'flex', flex: 1, justifyContent: 'center'}}>
        <div>
          <div className='w3-container'>
            <h1>{delay}</h1>
          </div>
          <div className='w3-bar-block'>
            <button
              className={'w3-panel w3-center w3-bar-item w3-btn ' + ledButtonClass}
              onClick={() => {
                const socket = getSocket();
                start = Date.now();
                socket.emit('gpioLed', { value: !this.state.led });
              }}
            >
                {'Toggle LED'}
            </button>
            <button
              className={'w3-panel w3-center w3-bar-item w3-btn ' + buzzerButtonClass}
              onClick={() => {
                const socket = getSocket();
                socket.emit('buzzer', { value: !this.state.buzzer });
              }}
            >
                {'Toggle Buzzer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  private readonly updateLED = (data?: Response) => {
    const end = Date.now();
    console.log('updateLED');
    // console.log(`${end - start} ms`);
    if (data && data.success) {

      this.setState({
        delay: `${end - start} ms`,
        led: data.value,
      });
    } else {
      console.log('something goes wrong?');
    }
  }

  private readonly updateBuzzer = (data?: Response) => {
    console.log('updateBuzzer');
    if (data && data.success) {
      this.setState({
        buzzer: data.value,
      });
    } else {
      console.log('something goes wrong?');
    }
  }
}

interface Response {
  success: boolean;
  value: boolean;
}
