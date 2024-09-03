import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import leaflet, { Map } from 'leaflet';
import { useEffect } from 'react';

type LeafletMapProps = {
    location: { latitude: string; longitude: string } | null;
    setLocation: React.Dispatch<React.SetStateAction<{ latitude: string; longitude: string } | null>>;
};

export default function LeafletMap({ location, setLocation }: LeafletMapProps) {
    const [map, setMap] = useState<Map>();

    useEffect(() => {
        if (!location && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                });
            });
        }
    }, [location, setLocation]);

    useEffect(() => {
        if (location && !map) {
            const myMap = leaflet.map('map').setView([parseFloat(location.latitude), parseFloat(location.longitude)], 15);
            setMap(myMap);
        }
    }, [location, map]);

    useEffect(() => {
        if (map && location) {
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            const marker = leaflet.marker([parseFloat(location.latitude), parseFloat(location.longitude)]).addTo(map);
            marker.bindPopup('I live here');

            map.on('click', (event) => {
                console.log(event);
                leaflet.marker([event.latlng.lat, event.latlng.lng]).addTo(map);
            });

            marker.on('click', () => {
                console.log('Found me!');
            });
        }
    }, [map, location]);

    return (
        <section id='map' style={{ width: '60svw', height: '60svh' }}></section>
    );
}
