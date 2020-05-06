const Sensor = require("../models/sensor");
const { validationResult } = require("express-validator"); //to validate the request informations

const createSensor = async (req, res, next) => {
  /* validating request using express validator package */
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error("Double check your inputs!!");
    error.code = 422;
    return next(error);
  }
  /*
   * Creating a newSensor using Sensor schema model.
   * Then saving it in mongoDB using save() query
   * if the query operation successfull, gives newly created sensor object as a response with code 201
   * otherwise it will throw a error.
   */
  const { status, floorNo, roomNo, co2, smoke } = req.body;
  const newSensor = new Sensor({
    status,
    floorNo,
    roomNo,
    co2,
    smoke,
  });

  try {
    await newSensor.save();
  } catch (err) {
    return next(err);
  }
  res.status(201).json({ sensor: newSensor.toObject({ getters: true }) });
};

/*
 * Retreving all the sensors using mongoose find() query.
 * if the query operation successfull, outputs the retrived sensor array using a map() as a response with code 200
 * otherwise it will throw a error with code 500.
 */

const getAllSensors = async (req, res, next) => {
  let sensors;
  try {
    sensors = await Sensor.find();
  } catch (err) {
    const error = new Error(
      "Could not retrive the sensors form the DB - database-error"
    );
    error.code = 500;
    return next(error);
  }
  res
    .status(200)
    .json({ sensors: sensors.map((s) => s.toObject({ getters: true })) });
};

const updateSensor = async (req, res, next) => {
  //checks for any validations error.
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const error = new Error("Please double check your inputs");
    error.code = 422;
    return next(error);
  }

  const { status, floorNo, roomNo, co2, smoke } = req.body; //retrieves all the request data using object destructuring.
  
  /* 
   * sId = retrives the passed user id from the url using params
   * Finds the given user id in the db to select the realted sensor using findById() method
   * then the user will store in selectedSensor variable.
  */
  const sId = req.params.sid;
  let selectedSensor;
  try {
    selectedSensor = await Sensor.findById(sId);
  } catch (err) {
    const error = new Error(
      "Could not retrive the exact sensor details from the DB"
    );
    error.code = 500;
    return next(error);
  }
  /* filter the null inputs and only the valid ones will updated*/
  if (status != null) {
    selectedSensor.status = status;
  }
  if (co2 != null) {
    selectedSensor.co2 = co2;
  }
  if (smoke != null) {
    selectedSensor.smoke = smoke;
  }
  if (roomNo != null) {
    selectedSensor.roomNo = roomNo;
  }
  if (floorNo != null) {
    selectedSensor.floorNo = floorNo;
  }
  /* 
   *After updating the selectedSensor object,
   *save the updated object in the db using save()
  */
  try {
    await selectedSensor.save();
  } catch (err) {
    const error = new Error("Could not save the updated sensor in db");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({ place: selectedSensor.toObject({ getters: true }) });
};

exports.createSensor = createSensor;
exports.getAllSensors = getAllSensors;
exports.updateSensor = updateSensor;
