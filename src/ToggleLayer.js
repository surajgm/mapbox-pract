import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VyYWpnbTEwIiwiYSI6ImNsMzhlcHBycTAwYWMzb21veDVhZG1yd2cifQ.V5RxbO6hceosPByjReqgtg";

const ToggleLayer = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef();

  const [layerValues, setLayerValues] = useState([]);
  // const [currentLayerID, setCurrentLayerID] = useState("");

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 15,
      center: [-71.97722138410576, -13.517379300798098],
      pitch: 50,
    });

    if (mapRef) {
      mapRef.current = map;
    }

    map.on("load", () => {
      map.addSource("museums", {
        type: "vector",
        url: "mapbox://mapbox.2opop9hr",
      });

      map.addLayer({
        id: "museums",
        type: "circle",
        source: "museums",
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": 8,
          "circle-color": "rgba(55,148,179,1)",
        },
        "source-layer": "museum-cusco",
      });

      map.addSource("contours", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });

      map.addLayer({
        id: "contours",
        type: "line",
        source: "contours",
        "source-layer": "contour",
        layout: {
          visibility: "visible",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#877b59",
          "line-width": 1,
        },
      });
    });

    map.on("idle", () => {
      if (!map.getLayer("contours") || !map.getLayer("museums")) {
        return;
      }

      const layer1 = map.getLayer("contours").id;
      console.log("layer1", layer1);

      const layer2 = map.getLayer("museums").id;
      console.log("layer2", layer2);

      const layerIDs = [layer1, layer2];
      setLayerValues(layerIDs);
    });

    return () => map.remove();
  }, []);

  const handleLayerChange = (e) => {
    console.log("handleLayerChange", e.target.value);
    const currentLayerID = e.target.value;
    const visibility = mapRef.current.getLayoutProperty(
      currentLayerID,
      "visibility"
    );

    if (visibility === "visible") {
      mapRef.current.setLayoutProperty(currentLayerID, "visibility", "none");
    } else {
      mapRef.current.setLayoutProperty(currentLayerID, "visibility", "visible");
    }
  };

  return (
    <div>
      <div className="layer-menu">
        {layerValues.map((value) => (
          <input
            type="button"
            key={value}
            className="layer-item"
            onClick={handleLayerChange}
            value={value}
          />
        ))}
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default ToggleLayer;
