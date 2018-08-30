import * as React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

export class Content extends React.PureComponent<ContentProps> {
  public render() {
    const {
      children,
    } = this.props;

    return (
      <div className='w3-container'>
        {children}
      </div>
    );
  }
}
