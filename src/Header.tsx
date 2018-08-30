import * as React from 'react';

interface HeaderState {
  value: boolean;
}

export class Header extends React.Component<{}, HeaderState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      value: false,
    };
  }

  public componentDidMount() {
    this.toggleLed();
  }

  public render() {
    const buttonClass = this.state.value ? 'w3-red' : 'w3-black';

    return (
      <React.Fragment>
        <h1>{'Hello World!'}</h1>
        <button
          className={buttonClass}
          onClick={this.toggleLed}>
            {'Toggle LED'}
        </button>
      </React.Fragment>
    );
  }

  private readonly toggleLed = () => {
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
}

interface Response {
  success: boolean;
  value: boolean;
}
