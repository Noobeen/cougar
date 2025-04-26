// client/src/components/Map.jsx
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { socket } from '../sockets.js';

const containerStyle = { width: '100%', height: '60vh' };
const defaultCenter   = { lat: 40.7399, lng: -74.1699 };

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [buses, setBuses] = useState({});

  useEffect(() => {
    socket.on('location_update', (d) =>
      setBuses(prev => ({ ...prev, [d.busId]: d }))
    );
    return () => socket.off('location_update');
  }, []);

  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={15} center={defaultCenter}>
      {Object.values(buses).map(({ busId, lat, lng }) => (
        <Marker key={busId} position={{ lat, lng }} label={busId} />
      ))}
    </GoogleMap>
  );
}
/*import { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api';
import { socket } from '../sockets.js';

const containerStyle = { width: '100%', height: '60vh' };
const defaultCenter = { lat: 40.7399, lng: -74.1699 };
const MAX_POINTS = 500; // cap history so memory doesn’t blow up

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // buses: { busId: { lat, lng, heading, path: [LatLngLiteral] } }
  const [buses, setBuses] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    socket.on('location_update', (d) => {
      setBuses((prev) => {
        const prevBus = prev[d.busId] || { path: [] };
        const nextPath = [...prevBus.path, { lat: d.lat, lng: d.lng }].slice(-MAX_POINTS);
        return {
          ...prev,
          [d.busId]: { ...d, path: nextPath },
        };
      });
    });
    return () => socket.off('location_update');
  }, []);

  // Auto‑center map to fit all markers when first point arrives
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    Object.values(buses).forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds, 80);
  }, [buses]);

  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <GoogleMap
      onLoad={(m) => (mapRef.current = m)}
      mapContainerStyle={containerStyle}
      zoom={14}
      center={defaultCenter}
    >
      {Object.values(buses).map(({ busId, lat, lng, path }) => (
        <>
          <Polyline
            key={`${busId}-poly`}
            path={path}
            options={{ strokeColor: '#4285F4', strokeWeight: 4 }}
          />
          <Marker
            key={`${busId}-marker`}
            position={{ lat, lng }}
            label={busId}
          />
        </>
      ))}
    </GoogleMap>
  );
}
```jsx
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { socket } from '../sockets.js';

const containerStyle = {
  width: '100%',
  height: '60vh',
};
const defaultCenter = { lat: 40.7399, lng: -74.1699 };

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [buses, setBuses] = useState({});

  useEffect(() => {
    socket.on('location_update', (d) =>
      setBuses((prev) => ({ ...prev, [d.busId]: d }))
    );
    return () => socket.off('location_update');
  }, []);

  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={15} center={defaultCenter}>
      {Object.values(buses).map(({ busId, lat, lng }) => (
        <Marker key={busId} position={{ lat, lng }} label={busId} />
      ))}
    </GoogleMap>
  );
}
*/