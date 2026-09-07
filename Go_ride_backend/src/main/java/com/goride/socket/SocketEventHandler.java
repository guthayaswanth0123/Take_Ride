package com.goride.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.Map;

@Slf4j
@Component
public class SocketEventHandler {

    private final SocketIOServer server;

    public SocketEventHandler(SocketIOServer server) {
        this.server = server;
    }

    @PostConstruct
    public void startServer() {
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());

        server.addEventListener("join-ride", String.class, onJoinRide());
        server.addEventListener("leave-ride", String.class, onLeaveRide());
        server.addEventListener("driver-location-update", Map.class, onDriverLocationUpdate());
        server.addEventListener("ride-status-update", Map.class, onRideStatusUpdate());

        try {
            server.start();
            log.info("Netty SocketIOServer started successfully");
        } catch (Exception e) {
            log.error("Failed to start Netty SocketIOServer: ", e);
        }
    }

    @PreDestroy
    public void stopServer() {
        if (server != null) {
            server.stop();
        }
    }

    private ConnectListener onConnected() {
        return client -> log.info("Client connected: {}", client.getSessionId());
    }

    private DisconnectListener onDisconnected() {
        return client -> log.info("Client disconnected: {}", client.getSessionId());
    }

    private DataListener<String> onJoinRide() {
        return (client, rideId, ackSender) -> {
            String roomName = "ride-" + rideId;
            client.joinRoom(roomName);
            log.info("Client {} joined room {}", client.getSessionId(), roomName);
        };
    }

    private DataListener<String> onLeaveRide() {
        return (client, rideId, ackSender) -> {
            String roomName = "ride-" + rideId;
            client.leaveRoom(roomName);
            log.info("Client {} left room {}", client.getSessionId(), roomName);
        };
    }

    private DataListener<Map> onDriverLocationUpdate() {
        return (client, data, ackSender) -> {
            String rideId = (String) data.get("rideId");
            Object location = data.get("location");
            if (rideId != null && location != null) {
                String roomName = "ride-" + rideId;
                server.getRoomOperations(roomName).sendEvent("driver-location-changed", location);
            }
        };
    }

    private DataListener<Map> onRideStatusUpdate() {
        return (client, data, ackSender) -> {
            String rideId = (String) data.get("rideId");
            if (rideId != null) {
                String roomName = "ride-" + rideId;
                server.getRoomOperations(roomName).sendEvent("ride-status-changed", data);
            }
        };
    }
}
