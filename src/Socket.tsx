import * as io from 'socket.io-client';

let socket: SocketIOClient.Socket | undefined;

export function getSocket(): SocketIOClient.Socket {
  if (socket === undefined) {
    socket = io.connect();
  }

  return socket;
}
