"""Simulate a shuttle driving in a 4‑point loop and push GPS to Socket.IO.

Usage:
  # default square path
  python simulate_gps.py

  # random walk
  python simulate_gps.py --random

  """
import argparse, itertools, math, random, time, socketio

sio = socketio.Client()

# ---------------------------------------------------------------------------
# Path generators
# ---------------------------------------------------------------------------

def square(lat, lng, side=0.0005):
    """Simple square loop ~55 m per side (0.0005°)."""
    pts = [
        (lat, lng),
        (lat, lng + side),
        (lat + side, lng + side),
        (lat + side, lng),
    ]
    while True:
        for (a_lat, a_lng), (b_lat, b_lng) in zip(pts, pts[1:] + pts[:1]):
            heading = math.degrees(math.atan2(b_lng - a_lng, b_lat - a_lat)) % 360
            yield a_lat, a_lng, heading

def random_walk(lat, lng, step=0.001):
    while True:
        lat += random.uniform(-step, step)
        lng += random.uniform(-step, step)
        heading = random.uniform(0, 360)
        yield lat, lng, heading

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

def run(args):
    sio.connect(f"http://{args.host}:{args.port}")
    print("[SIM] connected, emitting as", args.bus)

    gen = random_walk(args.lat, args.lng) if args.random else square(args.lat, args.lng)

    for lat, lng, heading in gen:
        sio.emit("location_update", {
            "lat": lat,
            "lng": lng,
            "heading": heading,
            "busId": args.bus,
        })
        time.sleep(args.interval)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=5001)
    parser.add_argument("--bus", default="shuttle‑sim")
    parser.add_argument("--lat", type=float, default=40.7399)
    parser.add_argument("--lng", type=float, default=-74.1699)
    parser.add_argument("--interval", type=float, default=1.0)
    parser.add_argument("--random", action="store_true")
    run(parser.parse_args())