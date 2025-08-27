// Minimal channel-based WebSocket server for cursor-talk-to-figma
// Protocol:
// - Client -> Server: { type: "join_channel", channel: string, role?: string }
// - Client -> Server: { type: "join", channel: string, role?: string }  // 추가된 join 타입
// - Client -> Server: { type: "publish", channel: string, payload: any }
// - Client -> Server: { type: "rpc_request", channel: string, requestId: string, method: string, params?: any, targetRole?: string }
// - Client -> Server: { type: "rpc_response", channel: string, requestId: string, result?: any, error?: any }
// - Client -> Server: { type: "ping" }
// - Server -> Client: { type: "joined", id: string, channel: string, role: string }
// - Server -> Client: { type: "event", channel: string, payload: any }
// - Server -> Client: { type: "rpc_request", channel: string, requestId: string, method: string, params: any }
// - Server -> Client: { type: "rpc_response", channel: string, requestId: string, result?: any, error?: any }
// - Server -> Client: { type: "pong", at: number }
// Minimal channel-based WebSocket server for cursor-talk-to-figma
// cursor-talk-to-figma-socket.js
const WebSocket = require("ws");

const PORT = Number(process.env.PORT || 3055);
const server = new WebSocket.Server({ port: PORT });

// 채널별 클라이언트 저장
const channelToClients = new Map();
// 클라이언트 정보 저장
const clientInfo = new Map();

let nextClientIdCounter = 1;

function ensureChannel(channel) {
  if (!channelToClients.has(channel)) {
    channelToClients.set(channel, new Set());
  }
  return channelToClients.get(channel);
}

function leaveChannel(ws) {
  const info = clientInfo.get(ws);
  if (!info || !info.channel) return;
  const set = channelToClients.get(info.channel);
  if (set) {
    set.delete(ws);
    if (set.size === 0) channelToClients.delete(info.channel);
  }
  info.channel = undefined;
}

function joinChannel(ws, channel, role) {
  console.log(`[DEBUG] joinChannel called with:`, { channel, role });
  
  leaveChannel(ws);
  const set = ensureChannel(channel);
  set.add(ws);
  
  const info = clientInfo.get(ws);
  console.log(`[DEBUG] clientInfo.get(ws) result:`, info);
  
  if (!info) {
    console.log(`[ERROR] clientInfo is undefined for WebSocket!`);
    console.log(`[DEBUG] clientInfo Map size:`, clientInfo.size);
    console.log(`[DEBUG] WebSocket readyState:`, ws.readyState);
    return null;
  }
  
  console.log(`[DEBUG] info before update:`, { id: info.id, channel: info.channel, role: info.role });
  
  info.channel = channel;
  info.role = role || info.role || "generic";
  
  const result = { id: info.id, channel: info.channel, role: info.role };
  console.log(`[DEBUG] joinChannel returning:`, result);
  
  return result;
}

function broadcastToChannel(channel, data, except) {
  const set = channelToClients.get(channel);
  if (!set) return;
  for (const client of set) {
    if (client !== except && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch {}
    }
  }
}

function sendToRole(channel, targetRole, data) {
  const set = channelToClients.get(channel);
  if (!set) return;
  for (const client of set) {
    const info = clientInfo.get(client);
    if (info && info.role === targetRole && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch {}
    }
  }
}

server.on("connection", (ws) => {
  const id = `c${nextClientIdCounter++}`;
  clientInfo.set(ws, { id, role: "generic" });
  console.log(`[conn] client ${id} connected`);

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      console.log(`[error] invalid JSON from client ${id}`);
      return;
    }

    // join / join_channel 처리
    if (msg && (msg.type === "join" || msg.type === "join_channel") && typeof msg.channel === "string") {
      const joined = joinChannel(ws, msg.channel, msg.role);
      
      if (!joined) {
        console.log(`[ERROR] joinChannel returned null, cannot send response`);
        return;
      }
      
      const response = { type: "joined", ...joined };
      console.log(`[DEBUG] sending response:`, response);
      
      try {
        ws.send(JSON.stringify(response));
        console.log(`[join] client ${joined.id} joined channel #${joined.channel} as ${joined.role}`);
      } catch (e) {
        console.log(`[error] failed to send join response to client ${joined.id}:`, e);
      }
      return;
    }

    // publish broadcast
    if (msg && msg.type === "publish" && typeof msg.channel === "string" && msg.payload !== undefined) {
      broadcastToChannel(msg.channel, { type: "event", channel: msg.channel, payload: msg.payload }, null);
      return;
    }

    // rpc request
    if (msg && msg.type === "rpc_request" && typeof msg.channel === "string" && typeof msg.requestId === "string" && typeof msg.method === "string") {
      const payload = { type: "rpc_request", requestId: msg.requestId, method: msg.method, params: msg.params || {}, channel: msg.channel };
      if (msg.targetRole) {
        sendToRole(msg.channel, msg.targetRole, payload);
      } else {
        broadcastToChannel(msg.channel, payload, null);
      }
      return;
    }

    // rpc response
    if (msg && msg.type === "rpc_response" && typeof msg.channel === "string" && typeof msg.requestId === "string") {
      broadcastToChannel(msg.channel, msg, null);
      return;
    }

    // ping
    if (msg && msg.type === "ping") {
      try {
        ws.send(JSON.stringify({ type: "pong", at: Date.now() }));
      } catch {}
      return;
    }

    console.log(`[unknown] client ${id} sent unknown message type:`, msg?.type);
  });

  ws.on("close", () => {
    leaveChannel(ws);
    const info = clientInfo.get(ws);
    console.log(`[disc] client ${info?.id || "unknown"} disconnected`);
    clientInfo.delete(ws);
  });
});

console.log(`WS server running on ws://127.0.0.1:${PORT}`);
