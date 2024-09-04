import { useState, useEffect } from 'react';
import leaflet, { Map, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new leaflet.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#449b92" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" stroke="#f5cc50" stroke-width="3" fill="#12182e"/>
      <circle cx="12" cy="12" r="5" fill="#ffbbf4"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MarkerData {
  lat: number;
  lng: number;
  question: string;
  answer: string;
}

interface LeafletMapProps {
  onMapClick: (lat: number, lng: number) => void;
  savedMarkers: MarkerData[];
  isEditable: boolean
}

function LeafletMap({ onMapClick, savedMarkers}: LeafletMapProps) {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [previewMarker, setPreviewMarker] = useState<Marker | null>(null);
  const [userMarker, setUserMarker] = useState<Marker | null>(null);

  // Hämtar aktuell position
  function getPosition() {
    if ('geolocation' in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    if (!position?.latitude) {
      getPosition();
    }
  }, []);

  // Initierar kartan och lägger till markörer
  useEffect(() => {
    if (position && !map) {
      const myMap = leaflet.map('map').setView([position.latitude, position.longitude], 15);

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(myMap);


      // Lägg till postion för användaren
      const marker = leaflet.marker([position.latitude, position.longitude], { icon: customIcon })
        .addTo(myMap)
        .bindPopup('HÄR ÄR JAG!');

      setUserMarker(marker);

      // Endast aktivera klick på kartan om det är Editable
      if ( onMapClick) {
        myMap.on('click', (event) => {
          const lat = event.latlng.lat;
          const lng = event.latlng.lng;
          onMapClick(lat, lng);

          const newpreviewMarker = leaflet.marker([lat, lng], { icon: customIcon })
            .addTo(myMap)
            .bindPopup('');

          setPreviewMarker(newpreviewMarker);
        });
      }

      setMap(myMap);

    }
  }, [position, map, onMapClick,  previewMarker, userMarker]);

  // Uppdaterar markörer
  useEffect(() => {
    if (map) {
      // Tar bort markörer från kartan som inte har någon tillhörande fråga och svar sparad
      map.eachLayer((layer) => {
        if (layer instanceof leaflet.Marker && layer !== previewMarker && layer !== userMarker) {
          map.removeLayer(layer);
        }
      });

      // Lägg till nya markörer
      savedMarkers.forEach((markerData) => {
        leaflet.marker([markerData.lat, markerData.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<strong>Fråga:</strong> ${markerData.question}<br/><strong>Svar:</strong> ${markerData.answer}`);
      });
    }
  }, [savedMarkers, map, previewMarker, userMarker]);

  return (
    <section id='map' style={{ width: '60svw', height: '60svh' }}></section>
  );
}

export default LeafletMap;

