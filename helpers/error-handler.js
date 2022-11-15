function errorHandler(err,req,res,next){
   if(err.name === 'Unauthorized'){
       return res.status(401).json({success: false, message: 'Unauthorized'});
   }
   if(err.name === 'Validation Error'){
       return res.status(400).json({success: false, message: 'Validation Error'});
   }
}

module.exports = errorHandler;