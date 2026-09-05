import { Server as SocketIOServer } from 'socket.io';

declare global {
  var io: SocketIOServer | undefined;
}

export const emitToRide = (rideId: string, event: string, data: any) => {
  if (global.io) {
    global.io.to(`ride-${rideId}`).emit(event, data);
  }
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (global.io) {
    global.io.to(`user-${userId}`).emit(event, data);
  }
};