import * as React from 'react';

interface HeaderState {
  value?: boolean;
}

export class Header extends React.Component<{}, HeaderState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      value: false,
    };
  }

  public componentDidMount() {
    this.getLedState();
  }

  public render() {
    const {
      value,
    } = this.state;

    if (value === undefined) { return null; }

    const buttonClass = value ? 'w3-red' : 'w3-black';

    return (
      <React.Fragment>
        <h1>{'Hello World!'}</h1>
        <button
          className={'w3-btn ' + buttonClass}
          onClick={this.toggleLed}>
            {'Toggle LED'}
        </button>
      </React.Fragment>
    );
  }

  private readonly getLedState = () => {
    fetch('gpioLed')
    .then((r) => {
      return r.json();
    }).then((r: Response) => {
      if (r.success) {
        this.setState({ value: r.value });
      } else {
        console.warn('error?');
      }
    });
  }

  private readonly toggleLed = () => {
    const newValue = !this.state.value;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('gpioLed', {
      method: 'PUT',
      body: JSON.stringify({ value: newValue }),
      headers,
    })
    .then((r) => {
      return r.json();
    }).then((r: Response) => {
      if (r.success) {
        this.setState({ value: r.value });
      } else {
        console.warn('error?');
      }
    });
  }
}

interface Response {
  success: boolean;
  value: boolean;
}
