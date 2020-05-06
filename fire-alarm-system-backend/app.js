const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const alarmRoutes=require("./routes/fire-alarm-routes");
const adminRoutes=require("./routes/admin-routes");

const app = express();
app.use(bodyParser.json());//extract the entire body portion of an incoming request.

/* 
 *this custom middleware use to solve the error when connecting the react. 
 *without these settings browser will throw bunch of CORS Errors errors. 
 *but Postman can still work without this middleware.
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/sensors',alarmRoutes);
app.use('/api/admin',adminRoutes);

/* 
 * This middle ware will handle all othe url requests excepts the ones which are mentioned above.
 * Those requset are invalid so we throw page not found with error code - 404
*/
app.use((req,res,next)=>{
    const error=new Error('page not found! - Fire Sensor System');
    error.code=404;
    next(error);
});

/* This middleware will handle the all errors which are throwen by other middlewares */
app.use((error,req,res,next)=>{
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code||500).json({message:error.message || 'Unknown -- Error !!'})
});
/*
 * If Connection to the MongoDB success, 
 * then it will start the node server on port 9000
 */
mongoose
  .connect('mongodb+srv://crhunter:Pass4mongodb@cluster0-hqncx.mongodb.net/fire-alarm?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(9000);
    console.log('server & db are up and running!!!');
  })
  .catch((err) => {
    console.log(err);
  });
  