import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { geoJsonData } from "./Data/geoJsonData";
import Popup from "./Popup";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);
  const popUpRef = useRef(
    new mapboxgl.Popup({ offset: 15, className: "popup" })
  );

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      pitch: 50,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
        }
      );

      map.addSource("citiesPointData", {
        type: "geojson",
        data: geoJsonData,
      });

      map.addLayer({
        id: "citiesPointLayer",
        type: "symbol",
        source: "citiesPointData",
        layout: {
          "icon-image": "custom-marker",
          //"icon-image": "bakery-15",
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1.25],
          "text-anchor": "top",
        },
      });
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    //   map.on("click", "citypointsLayer", (e) => {
    //     console.log("e", e);
    //     // Copy coordinates array.
    //     const coordinates = e.features[0].geometry.coordinates.slice();
    //     const description = e.features[0].properties.description;
    //     const htmlDescription = <p>{description}</p>;

    //     new mapboxgl.Popup()
    //       .setLngLat(coordinates)
    //       .setHTML(htmlDescription)
    //       .addTo(map);
    //   });

    map.on("click", "citiesPointLayer", (e) => {
      console.log("e", e.features);
      if (e.features.length) {
        const feature = e.features[0];
        // create popup node
        const popupNode = document.createElement("div");
        ReactDOM.render(<Popup feature={feature} />, popupNode);
        // set popup on map
        popUpRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map);
      }
    });

    map.on("mouseenter", "citiesPointLayer", (e) => {
      if (e.features.length) {
        map.getCanvas().style.cursor = "pointer";
      }
    });

    // reset cursor to default when user is no longer hovering over a clickable feature
    map.on("mouseleave", "citiesPointLayer", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
