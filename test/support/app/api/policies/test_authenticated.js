module.exports = function( caminio ){
  
  return function( req, res, next ){
    req.text = 'testAuthenticated';
    next();
  }

}