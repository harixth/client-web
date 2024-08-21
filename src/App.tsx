import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ky from "ky";
import "./App.css";
import { Driver, DriversResponse } from "./type";

function App() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [lng, setLng] = useState<number>(127.11);
  const [lat, setLat] = useState<number>(37.3939);
  const [zoom, setZoom] = useState<number>(15);
  const [driverCount, setDriverCount] = useState(1);
  const [pickupLocation, setPickupLocation] = useState<mapboxgl.LngLat>(
    new mapboxgl.LngLat(lng, lat)
  );
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
        setPickupLocation(
          new mapboxgl.LngLat(
            currentMap.getCenter().lng,
            currentMap.getCenter().lat
          )
        );
      });
    }
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversInfo = await ky<DriversResponse>(
          `https://qa-interview-test.qa.splytech.dev/api/drivers?latitude=${lat}&longitude=${lng}&count=${driverCount}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "no-cors",
          }
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
  }, [driverCount, pickupLocation]);

  useEffect(() => {
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }

    if (map.current) {
      const img = document.createElement("img");
      img.src = "/pickup.png";
      img.className = "marker";

      marker.current = new mapboxgl.Marker({
        element: img,
        anchor: "bottom",
      })
        .setLngLat([pickupLocation.lng, pickupLocation.lat])
        .setPopup(
          new mapboxgl.Popup({
            offset: 50,
            focusAfterOpen: true,
            closeButton: false,
            closeOnClick: true,
            closeOnMove: false,
          }).setText(`waiting time ${pickupTime} min`)
        )
        // @ts-ignore
        .addTo(map.current)
        .togglePopup();
    }
    return () => {};
  }, [map.current, pickupLocation]);

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

  const getBackgroundSize = () => {
    return { backgroundSize: `${(driverCount * 100) / 50}% 100%` };
  };

  return (
    <div className="container">
      <div className="sidebar">
        Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <h3>
        {driverCount} {driverCount > 1 ? "Drivers" : "Driver"}
      </h3>
      <input
        type="range"
        min="1"
        max={50}
        onChange={(e) => setDriverCount(Number(e.target.value))}
        style={getBackgroundSize()}
        value={driverCount}
      />
    </div>
  );
}

export default App;
