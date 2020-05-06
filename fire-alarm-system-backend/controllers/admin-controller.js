const Admin=require("../models/admin");
const { validationResult } = require("express-validator");//to validate the request informations

const signUp = async (req, res, next) => {
    /* validating request using express validator package */
    const validationErrors = validationResult(req); 
    if (!validationErrors.isEmpty()) {
      const error = new Error("Double check your inputs!!");
      error.code = 422;
      return next(error);
    }
    //To find out if the email already exists in the db
    const { name,email,password } = req.body;
    let hasRegistered;
    try{

        hasRegistered=await Admin.findOne({email:email});
    }catch(err){
      const error = new Error("Something went wrong on DB!");
      error.code = 422;
      return next(error);
    }
    if(hasRegistered){
      const error = new Error("Email already in use, Try Login instead!");
      error.code = 422;
      return next(error);
    }
    /* 
     * Creating a newAdmin using Admin schema model.
     * Then saving it in mongoDB using save() query
     * if the query operation successfull, gives newly created admin object as a response with code 201
     * otherwise it will throw a error. 
    */
    const newAdmin = new Admin({
      name,
      email,
      password
    });
  
    try {
      await newAdmin.save();
    } catch (err) {
      return next(err);
    }
    res.status(201).json({ admin: newAdmin.toObject({ getters: true }) });
  };

const login=async(req,res,next)=>{

    const {email,password}=req.body; //retrieves request body data using object destructuring method
    
    /* 
     * finds the given email is exists in the db using findOne() query
     * if the email exists it will match given password with the real password which stored in the DB
     * when operation success, gives outputs admins details as a response.  
    */
    let identifiedAdmin;
    try{
        
        identifiedAdmin= await Admin.findOne({email:email})
    }catch(err){
        const error = new Error("Something went wrong, when finding the admin's details from db");
        error.code = 500;
        return next(error);
    }
    
    if(!identifiedAdmin || identifiedAdmin.password !==password){
        const error = new Error("Invalid Email or Password ");
        error.code = 422;
        return next(error);
    }
    res.json({message:"Admin logged in!!",user:identifiedAdmin.toObject({getters:true})});
}
  
  exports.signUp=signUp;
  exports.login=login;