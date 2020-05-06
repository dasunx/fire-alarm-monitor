import React from "react";
import "./App.css";
import { SensorList } from "./components/sensor-list/sensor-list.component";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      sensors: [],
    };
  }
 
  componentDidMount() {
    this.getSensors();
    this.timer=setInterval(() => this.getSensors(), 40000);//this will call the function every 40 seconds(40000ms=40s)
    
  }
  componentWillUnmount(){
    clearInterval(this.timer);//stop the calling, when component unmount
  }

  /* 
  * This getSensor() function will fetch data from the REST API
  * Then store the result in state->sensors[] array.
  */
  getSensors(){
    fetch("http://localhost:9000/api/sensors")
      .then((res) => res.json())
      .then((sen) => this.setState({ sensors: sen.sensors }));
  }
  render() {
    const { sensors } = this.state;
    return (
      <div className="container">
        <h1 className="app-title">Fire Alarm System</h1>
        <SensorList array={sensors}></SensorList> {/* Pass the whole array to the SensorList component using props*/}
      </div>
    );
  }
}

export default App;
