import 'leaflet/dist/leaflet.css';
import leaflet, { Map } from 'leaflet';
import { useState, useEffect } from 'react';

export default function LeafletMap() {

    const [position, setPosition] = useState<GeolocationCoordinates>();
    const [map, setMap] = useState<Map>();

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
    
      useEffect(() => {
        if (position?.latitude && !map) {
          const myMap = leaflet
            .map('map')
            .setView([position?.latitude, position?.longitude], 15);
    
          setMap(myMap);
        }
      }, [position]);
    
      useEffect(() => {
        if (map && position) {
          leaflet
            .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            })
            .addTo(map);
    
          const marker = leaflet
            .marker([position?.latitude, position?.longitude])
            .addTo(map);
    
          marker.bindPopup('I live here');
    
          map.on('click', (event) => {
            console.log(event);
            const marker = leaflet
              .marker([event.latlng.lat, event.latlng.lng])
              .addTo(map);
          });
    
          marker.on('click', () => {
            console.log('Found me!');
          });
        }
      }, [map]);
      
    return (
      <section id='map' style={{width: '60svw', height: '60svh'}}></section>  
    )
}