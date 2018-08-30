import * as React from 'react';

import { Content } from './Content';
import { Header } from './Header';

interface AppProps {
}

interface AppState {
}

export class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
  }

  public render() {
    return (
      <div className='w3-theme-d2 flexContainer'>
        <Content>
          <Header/>
        </Content>
      </div>
    );
  }
}
