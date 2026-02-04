const { ImageReduce } = require('../../service/imageSizeReducer');
const { LocalMulter } = require('../../service/localMulter');
const { profileDetails, createClubPost } = require('./profile.controller');

const profileV2Router = require('express')();


profileV2Router.get('/userDetail/role/:role/user/:userId',profileDetails)
profileV2Router.post('/createPost',LocalMulter.single("img")
,ImageReduce(500,"profile/post"),createClubPost)



module.exports = profileV2Router 