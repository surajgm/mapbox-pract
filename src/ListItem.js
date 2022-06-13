import React, { useRef } from "react";

const ListItem = ({ symbol, layerID, handleCheckMark}) => {
const inputRef = useRef()
  const handleClick = () => {
    console.log("inputRef",inputRef);
    const checkedValue = inputRef.current.checked
    console.log("checkedValue", checkedValue);
    const layerItem = { checkedValue, layerID, symbol };
    handleCheckMark(layerItem);
  };
  return (
    <li className="li-item">
      <input
        type="checkbox"
        id={layerID}
        checked
        ref={inputRef}
        onChange={handleClick}
      />
      <label htmlFor={layerID}>{symbol}</label>
    </li>
  );
};

export default ListItem;
