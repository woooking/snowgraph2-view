import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as SockJS from 'sockjs-client';
import * as WebStomp from 'webstomp-client';
import WebSocketWrapper from './components/websocket/WebSocketWrapper';
import { WEBSOCKET_ENDPOINT } from './config';
import registerServiceWorker from './registerServiceWorker';
import App from './views/App';

const socket = new SockJS(WEBSOCKET_ENDPOINT);
export const stomp = WebStomp.over(socket);

stomp.connect({}, () => {
  return;
});

ReactDOM.render(
  <BrowserRouter>
    <WebSocketWrapper client={stomp}>
      <App/>
    </WebSocketWrapper>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
