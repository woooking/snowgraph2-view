import * as React from 'react';
import * as WebStomp from 'webstomp-client';
import { stomp } from '../../index';

interface WebSocketWrapperProps {
  client: WebStomp.Client;
}

export interface WebsocketProps {
  send: (destination: string, data: any) => void;
}

const {Provider, Consumer} = React.createContext<WebStomp.Client>(stomp);

class WebSocketWrapper extends React.Component<WebSocketWrapperProps, {}> {
  public render() {
    return <Provider value={this.props.client}>{this.props.children}</Provider>
  }
}

export function withWebSocket<P extends WebsocketProps>(WrappedComponent: React.ComponentClass<P>) {
  class WebSocketWrapped extends React.Component<P> {
    public render() {
      return <Consumer>
        {
          value => (
            <WrappedComponent
              {...this.props}
              send={value.send}
            />
          )
        }
      </Consumer>
    }
  }

  return WebSocketWrapped;
}

export default WebSocketWrapper;