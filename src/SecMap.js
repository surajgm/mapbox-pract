import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Popup from "./Popup";
import { secGeoJsonData } from "./Data/secGeoJsonData";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
//mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_SEC_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [-111.75, 40.581],
      zoom: 12,
      pitch: 60,
      bearing: 80,
    });

    console.log("mapObj", map);

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxZoom: 16,
      });

      map.setTerrain({ source: "mapbox-dem" });

      map.addSource("avalanche-paths", {
        type: "vector",
        url: "mapbox://lcdesigns.arckuvnm",
      });

      map.addSource("snotel-sites", {
        type: "geojson",
        data: secGeoJsonData,
      });

      map.addSource("bus-routes", {
        type: "geojson",
        data: "https://opendata.arcgis.com/datasets/4347f3565fbe4d5dbb97b016768b8907_0.geojson",
      });

      //   map.addLayer({
      //     id: "avalanche-paths-fill",
      //     type: "fill",
      //     source: "avalanche-paths",
      //     "source-layer": "Utah_Avalanche_Paths-9s9ups",
      //     paint: {
      //       "fill-opacity": 0.5,
      //       "fill-color": "#f05c5c",
      //     },
      //   });

      //   map.addLayer({
      //     id: "snotel-sites-circle",
      //     type: "circle",
      //     source: "snotel-sites",
      //     paint: {
      //       "circle-color": "#1d1485",
      //       "circle-radius": 8,
      //       "circle-stroke-color": "#ffffff",
      //       "circle-stroke-width": 2,
      //     },
      //   });
      //   map.addLayer({
      //     id: "snotel-sites-label",
      //     type: "symbol",
      //     source: "snotel-sites",
      //     layout: {
      //       "text-field": ["get", "Station Name"],
      //       "text-size": 16,
      //       "text-offset": [0, -1.5],
      //     },
      //     paint: {
      //       "text-color": "#1d1485",
      //       "text-halo-color": "#ffffff",
      //       "text-halo-width": 0.5,
      //     },
      //   });

      //   map.addLayer({
      //     id: "bus-routes-line",
      //     type: "line",
      //     source: "bus-routes",
      //     paint: {
      //       "line-color": "#15cc09",
      //       "line-width": 4,
      //     },
      //   });

      //   map.addLayer({
      //     id: "sky",
      //     type: "sky",
      //     paint: {
      //       "sky-type": "atmosphere",
      //       "sky-atmosphere-sun": [0.0, 90.0],
      //       "sky-atmosphere-sun-intensity": 15,
      //     },
      //   });
    });

    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
