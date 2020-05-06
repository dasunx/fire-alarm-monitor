const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const sensorSchema=new Schema({
    status:{type:Boolean,required:true},
    floorNo:{type:Number,required:true},
    roomNo:{type:Number,required:true},
    co2:{type:Number,required:true,min:0,max:10},
    smoke:{type:Number,required:true,min:0,max:10}
});
/* 
 *This is where we converted the above Schema into a mongoose model
 *here,SensorSchema will be stored as a collection in the mongoDB. 
 *Sensor->('sensors' will be the name of the collection.)
 */
module.exports=mongoose.model('Sensor',sensorSchema);