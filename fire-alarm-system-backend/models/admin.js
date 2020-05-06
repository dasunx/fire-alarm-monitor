const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');//to validate the emails
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},//this will create an seperate id for email. but to uniqe this email from the database we have to import the mongoose-unique-validator package.
    password:{type:String,required:true,minlength:3},  
});
adminSchema.plugin(uniqueValidator);// to add the unique behaviour to the email, have used mongoose-unique-validator package as mentioned above.
/* 
 *This is where we converted the above Schema into a mongoose model
 *here,AdminSchema will be stored as a collection in the mongoDB. 
 *Admin->('admins' will be the name of the collection.)
 */
module.exports=mongoose.model('Admin',adminSchema);