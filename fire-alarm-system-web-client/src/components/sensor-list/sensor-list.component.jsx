import React from "react";
import Sensor from "../sensor/sensor.component";
export const SensorList = (props) => {
  return (
    <div className="row">
      {/* Looping the array using map() function*/}
      {props.array.map((mon) => (
        <Sensor key={mon.id} sensor={mon}></Sensor> /* Passing each array member to the Sensor component using props*/
      ))}
    </div>
  );
};
