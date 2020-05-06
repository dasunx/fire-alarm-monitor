import React from "react";
import alert1 from "../../assets/images/alert-1.png";
import alert2 from "../../assets/images/alert-2.png";
import alert3 from "../../assets/images/alert-3.png";

/* 
* sStatus - going through the below logic, it will assign a value
* url - it will load the related image to the current status of sensor 
*/
const Sensor = (props) => {
  let sStatus;
  let url;
  if (!props.sensor.status) {
    sStatus = "inactive";
    url = alert3;
  } else {
    if (props.sensor.co2 > 5 || props.sensor.smoke > 5) {
      sStatus = "danger";
      url = alert1;
    } else {
      sStatus = "normal";
      url = alert2;
    }
  }
  return (
    /* 
     * Used the bacticks method to create all the css classNames according to the sensor status (sStatus)
     * Used Ternary Operator to handle all the logics
     * All other sensor details retrived using props.sensor
     */
    <div className="col-lg-6 card-holder">
      <div
        className={`card ${
          sStatus === "inactive"
            ? "card--inactive"
            : sStatus === "danger"
            ? "card--fire"
            : "card--normal"
        }`}
      >
        <div className="card__image-container">
          <img src={url} alt="alert-sign" className="card__image" />
        </div>

        <div className="card__caption">
          <h1 className="card__name">
            {props.sensor.status ? "Active" : "Inactive"}
          </h1>
          
          <h3 className="card__type">{`${
            sStatus === "inactive"
              ? "Activate the sensor!"
              : sStatus === "danger"
              ? "Danger"
              : "Normal"
          }`}</h3>

          <div className="card__stats">
            <div className="row">
              <div className="col-6 card__stats-title">Status</div>
              <div className="col-6 card__stats-value">
                {props.sensor.status ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="row">
              <div className="col-6 card__stats-title">Floor No</div>
              <div className="col-6 card__stats-value">
                {props.sensor.floorNo}
              </div>
            </div>

            <div className="row">
              <div className="col-6 card__stats-title">Room No</div>
              <div className="col-6 card__stats-value">
                {props.sensor.roomNo}
              </div>
            </div>

            <div className="row">
              <div className="col-6 card__stats-title">Smoke</div>
              <div className="col-6 card__stats-value">
                {`${sStatus==="inactive"?"__": props.sensor.smoke}`}
              </div>
            </div>

            <div className="row">
              <div className="col-6 card__stats-title">Co2</div>
              <div className="col-6 card__stats-value">{`${sStatus==="inactive"?"__": props.sensor.co2}`}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card__ability ">
                <div className="row">
                  <div className="col-12">
                    <h4 className="card__label">Smoke</h4>
                  </div>
                  <div className="col-12 circle-container">
                    <div
                      className={`card ${
                        sStatus === "inactive"
                          ? "yellow-circle"
                          : props.sensor.smoke > 5
                          ? "red-circle"
                          : "green-circle"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card__ability ">
                <div className="row">
                  <div className="col-12">
                    <h4 className="card__label">Co2</h4>
                  </div>
                  <div className="col-12 circle-container">
                  <div
                      className={`card ${
                        sStatus === "inactive"
                          ? "yellow-circle"
                          : props.sensor.co2 > 5
                          ? "red-circle"
                          : "green-circle"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sensor;
