import React from "react";

const Marker = ({ text, onClick,color }) => <div class="marker shadow-lg" style={{backgroundColor: color}} alt={text} onClick={onClick}></div>;


export default Marker;
