import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { placesData } from "./Data/placesData";
import "./Map.css";
import ListItem from "./ListItem";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapWithFilter = () => {
  const [sourceUniqueFeatures, setSourceFeatures] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-77.04, 38.907],
      zoom: 12,
      pitch: 50,
    });

    if (mapRef) {
      mapRef.current = map;
    }

    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: placesData,
      });

      const { features } = placesData;
      console.log("features",features)

      // To set the redundant features with same icon into unique features with unique icon
      const featuresIcons = features.map(feature => feature.properties.icon)
      const uniqueFeatures = [...new Set(featuresIcons)]
      console.log('uniqueFeatures', uniqueFeatures);

      setSourceFeatures(uniqueFeatures)

      for (const feature of features) {
        const symbol = feature.properties.icon;
        const layerID = `poi-${symbol}`;

        if (!map.getLayer(layerID)) {
          map.addLayer({
            id: layerID,
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": `${symbol}-15`,
              "icon-allow-overlap": true,
            },
            filter: ["==", "icon", symbol],
          });
        }
      }
    });
    return () => map.remove();
  }, []);

  const handleCheckMark = (layerItem) => {
    const { layerID, checkedValue } = layerItem;

    mapRef.current.setLayoutProperty(
      layerID,
      "visibility",
      checkedValue ? "visible" : "none"
    );
  };

  return (
    <div>
      <ul className="ul-menu">
        {sourceUniqueFeatures.map((icon, index) => (
          <ListItem
            key={index}
            symbol={icon}
            layerID={`poi-${icon}`}
            handleCheckMark={handleCheckMark}
          
          />
        ))}
      </ul>
      <div className="map-container" ref={mapContainerRef} />;
    </div>
  );
};

export default MapWithFilter;
