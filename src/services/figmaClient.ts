// Lightweight WebSocket client to join a channel on the local figma-ws-server

type JsonValue = any;

let socket: WebSocket | null = null;
let activeChannelCode: string | null = null;
let heartbeatTimer: any = null;
let reconnectTimer: any = null;

const DEFAULT_WS_URL = 'ws://127.0.0.1:8080';

function clearHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function scheduleReconnect(channelCode: string, wsUrl: string) {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    tryConnect(channelCode, wsUrl);
  }, 3000);
}

function tryConnect(channelCode: string, wsUrl: string) {
  activeChannelCode = channelCode;
  try {
    socket = new WebSocket(wsUrl);
  } catch {
    scheduleReconnect(channelCode, wsUrl);
    return;
  }

  socket.onopen = () => {
    try {
      socket?.send(
        JSON.stringify({ type: 'join_channel', channel: channelCode, role: 'app' })
      );
    } catch {}

    clearHeartbeat();
    heartbeatTimer = setInterval(() => {
      try {
        socket?.send(JSON.stringify({ type: 'ping' }));
      } catch {}
    }, 25000);
  };

  socket.onmessage = (_event) => {
    // Messages are not consumed by the app right now
  };

  socket.onerror = () => {
    // noop
  };

  socket.onclose = () => {
    clearHeartbeat();
    socket = null;
    if (activeChannelCode) {
      scheduleReconnect(activeChannelCode, wsUrl);
    }
  };
}

export function startFigmaChannel(channelCode: string, wsUrl: string = DEFAULT_WS_URL) {
  if (socket) {
    try { socket.close(); } catch {}
    socket = null;
  }
  clearHeartbeat();
  tryConnect(channelCode, wsUrl);
}

export function publishToFigmaChannel(payload: JsonValue) {
  if (!socket || !activeChannelCode) return;
  try {
    socket.send(
      JSON.stringify({ type: 'publish', channel: activeChannelCode, payload })
    );
  } catch {}
}


