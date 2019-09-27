const jsonWebT = require('jsonwebtoken');

module.exports = (req, res, next) =>{
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jsonWebT.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) {
       throw 'Invalid user ID';
      } else {
       next();
      }
      } catch {
       res.status(401).json({
       error: new Error('Invalid request!')
     });
   }
}   
class OwnershipError extends Error {
        constructor () {
         super()
         this.name = 'OwnershipError';
         this.message = 'The provided token does not match the owner of this document';
        }
    }
 

class BadParamsError extends Error {
   constructor () {
     super();
     this.name = 'BadParamsError';
     this.message = 'A required parameter was omitted or invalid';
   }
}

class BadCredentialsError extends Error {
  constructor () {
    super()
    this.name = 'BadCredentialsError';
    this.message = 'The provided username or password is incorrect';
  }
}

// this method checks if the user trying to modify a resource is the owner of
// resource, and throws an error if not

// `requestObject` should be the actual `req` object from the route file
const requireOwnership = (requestObject, resource) => {
  // `requestObject.user` will be defined in any route that uses `requireToken`
  // `requireToken` MUST be passed to the route as a second argument
  if (!requestObject.user._id.equals(resource.owner)) {
    throw new OwnershipError();
  }
}

// if the client passes an ID that isn't in the DB, we want to return 404
const handle404 = record => {
  if (!record) {
    throw new OwnershipError ();
  } else {
    return record
  }
}

module.exports = {
  requireOwnership,
  handle404,
  BadParamsError,
  BadCredentialsError
};

   
