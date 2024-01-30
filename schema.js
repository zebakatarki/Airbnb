const Joi = require('joi');

//Listings schema to validate the data which is cmg from client side that too from hoppscotch body
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null), //mongoose will handle default image
        category: Joi.string().valid('iconicCity', 'castle', 'pool', 'camping', 'farms', 'arctic', 'ship', 'tropical', 'house', 'golf', 'beachFront','ski-in-out').required()
        
    }).required(),
});

//Review schema
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        Comment:Joi.string().required(),        
    }).required(),
});