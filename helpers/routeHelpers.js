const Joi = require('@hapi/joi')

module.exports = {
  validateBody: (schema) => {
    return (req, res, next)=>{
      const result = schema.validate(req.body)
      if (result.error){
        return res.status(400).send(result.error.name +" : "+result.error.details[0].message)
      }
      if(!req.value){req.value ={} }
        req.value['body'] = result.value
        next()
    }
  },

  schemas: {
    authSchema: Joi.object({
      username: Joi.string().alphanum().min(3).max(12).required(),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).required()
    })
  }
}
