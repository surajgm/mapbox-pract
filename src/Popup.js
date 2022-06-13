import React from "react";

const Popup = ({ feature }) => {
  const { title, address, description } = feature.properties;
  return (
    <div>
      <h3>{title}</h3>
      <h4>{address}</h4>
      <p>{description}</p>
    </div>
  );
};

export default Popup;
