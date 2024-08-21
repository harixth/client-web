import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ky from "ky";
import "./App.css";
import { Driver, DriversResponse } from "./type";

function App() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(127.11);
  const [lat, setLat] = useState<number>(37.3939);
  const [zoom, setZoom] = useState<number>(14);
  const [driverCount, setDriverCount] = useState(1);
  const [pickupTime, setPickupTime] = useState<number>(0);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      accessToken:
        "pk.eyJ1IjoiZ2VtYWJ5dGUiLCJhIjoiY20wMjFuZGNxMXY3ZDJtczIycHZ5cWNjbSJ9.gNsD2IfrQgNGPibivI0gug",
      zoom: zoom,
    });
    const currentMap = map.current;
    if (currentMap) {
      map.current.on("move", () => {
        setLng(currentMap.getCenter().lng);
        setLat(currentMap.getCenter().lat);
        setZoom(currentMap.getZoom());
      });
    }
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversInfo = await ky<DriversResponse>(
          `https://qa-interview-test.qa.splytech.dev/api/drivers?latitude=${lat}&longitude=${lng}&count=${driverCount}`
        ).json();
        if (driversInfo) {
          setPickupTime(driversInfo.pickup_eta);
          setDrivers(driversInfo.drivers);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrivers();
  }, [driverCount]);

  useEffect(() => {
    if (map.current) {
      drivers.forEach((d) => {
        const { latitude, longitude, bearing } = d.location;
        const img = document.createElement("img");
        img.src = "/car.png";
        img.className = "marker";

        new mapboxgl.Marker({
          element: img,
          anchor: "bottom",
          rotation: bearing,
        })
          .setLngLat([longitude, latitude])
          // @ts-ignore
          .addTo(map.current);
      });
    }
  }, [map.current, drivers]);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng.toFixed(4)} | Latitude: {lng.toFixed(4)} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
