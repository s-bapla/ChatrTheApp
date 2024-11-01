from flask import Flask, request, send_from_directory
from flask_socketio import join_room, leave_room, send, SocketIO
import os
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}

dist_folder = os.path.join(os.getcwd(), 'dist')
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    rooms[request.sid] = {'username': username, 'room': room}
    send(f"{username} has joined the room {room}.", to=room)


@socketio.on('leave')
def handle_leave(data):
    sid = request.sid
    if sid in rooms:
        username = rooms[sid]['username']
        room = rooms[sid]['room']
        leave_room(room)
        send(f"{username} has left the room {room}.", to=room)
        del rooms[sid]
    else:
        print(f"Warning: SID {sid} not found in rooms dictionary.")


@socketio.on('message')
def handle_message(data):
    room = data['room']
    message = f"{rooms[request.sid]['username']}: {data['message']}"
    send(message, to=room)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True, allow_unsafe_werkzeug=True)
