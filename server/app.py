from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import os

# ---------------------------------------------------------------------------
# Basic config
# ---------------------------------------------------------------------------
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET", "secret")

# Socket.IO – allow the same origins that CORS allows
socketio = SocketIO(app, cors_allowed_origins=os.getenv("CORS_ORIGINS", "*"),async_mode="eventlet")

# ---------------------------------------------------------------------------
# Health‑check route (optional)
# ---------------------------------------------------------------------------
@app.route("/ping")
def ping():
    return {"status": "ok"}, 200

# ---------------------------------------------------------------------------
# WebSocket handlers – ESP32 sends `location_update`
# ---------------------------------------------------------------------------
@socketio.on("connect")
def on_connect():
    print("[WS] client connected:", request.sid)
    emit("server_ack", {"msg": "connected"})

@socketio.on("location_update")
def on_location(data):
    """Expect JSON from ESP32: {lat, lng, heading, busId}"""
    print("[GPS]", data)
    # For now just broadcast to any listening dashboards (front‑end)
    emit("location_update", data, broadcast=True, include_self=False)

@socketio.on("chat_msg")
def on_chat(data):
    """Receive JSON like {"text": "hello", "user": "browser"} and broadcast it."""
    print("[CHAT]", data)
    emit("chat_msg", data, broadcast=True) 
@socketio.on("disconnect")
def on_disconnect():
    print("[WS]", request.sid, "disconnected")

# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5179, debug=True)