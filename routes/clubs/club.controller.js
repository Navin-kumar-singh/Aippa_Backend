const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { Op } = require("sequelize");

const createClub = async(req,res)=>{
    let body = req.body;
    try {
        // console.log("this is body", req.body)
        console.log("req.file", req.file)
         body.logo = req.file?.Location

        const club = await DBMODELS.clubs.create(body)
        console.log("this is club", club)
        res.status(201).json({message:'succesfully create',result:club});
    } catch (error) {
        res.status(500).json({ error: 'Error creating club: ' + error.message });
    }
}


const getAllClubs = async (req, res) => {
  try {
    const clubs = await DBMODELS.clubs.findAll();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: 'Error getting clubs: ' + error.message });
  }
};

const getAllFollowedClubByUser = async(req,res)=>{
  const {userId, userType} = req.body
  // console.log("thisi si req.body", req.body)
  try {
    const user = userType==='institute'?await DBMODELS.club_institutes.findByPk(userId)
                                        :await DBMODELS.club_students.findByPk(userId)
    // console.log("this is user", user)
    const clubIds = user.all_clubs
    let clubs = []
    for(let i=0; i<clubIds.length;i++){
      const club = await DBMODELS.clubs.findByPk(clubIds[i]);
      clubs = [...clubs, club]
    }
    return res.status(200).json({message:"successfully get", clubs})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

const getAllpublicClub = async (req, res) => {
  try {
    const publicClubs = await DBMODELS.clubs.findAll({
      where: { type: 'public' },
    });
    res.status(200).json(publicClubs);
  } catch (error) {
    res.status(500).json({ error: 'Error getting public clubs: ' + error.message });
  }
};
const getClubById = async (req, res) => {
  const {id} = req.params;
  try {
    const club = await DBMODELS.clubs.findByPk(id);
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: 'Error getting public clubs: ' + error.message });
  }
};


const getPrivateClubByInstituteId = async (req, res) => {
  const {id} = req.params; 
  try {
    const privateClubs = await DBMODELS.clubs.findAll({
      where: {
        type: 'private',
        instituteId: id,
      },
    });
    res.status(200).json(privateClubs);
  } catch (error) {
    res.status(500).json({ error: 'Error getting private clubs: ' + error.message });
  }
};

const deletePrivateClubByInstituteId = async (req, res) => {
  const {id} = req.params;
  try {
    const deletedCount = await DBMODELS.clubs.destroy({
      where: {
        type: 'private',
        instituteId: id,
      },
    });
    res.status(200).json({ message: `${deletedCount} private club(s) deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting private clubs: ' + error.message });
  }
};

const deleteClub = async (req, res) => {
  const {id} = req.params;
  try {
    const deletedCount = await DBMODELS.clubs.destroy({
      where: {
        
        id: id,
      },
    });
    res.status(200).json({ message: `${deletedCount} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting private clubs: ' + error.message });
  }
};

const updateClubById = async (req, res) => {
  const {id} = req.params; 
  const body = req.body;
  try {
    body.logo = req.file?.Location

    console.log(body)
    const clubToUpdate = await DBMODELS.clubs.findOne({
      where: { id: id },
    });

    if (!clubToUpdate) {
      return res.status(404).json({ error: 'Club not found.' });
    }

    await clubToUpdate.update(body);

    const updatedClub = await DBMODELS.clubs.findByPk(id);

    res.status(200).json({ message: 'Club updated successfully.', result: updatedClub });
  } catch (error) {
    res.status(500).json({ error: 'Error updating club: ' + error.message });
  }
};




const getStudentDetail = async(req,res)=>{
    try {
        const {id} = req.params;
        const details = await DBMODELS.students.findByPk(id,{
          attributes:['first_name',
            'last_name',
            'email',
            'gender',
            'instituteId',
            'address',
            'role',
            'bio',
            'contact',
            'profile',
            'banner',
            'dob',
            'fb',
            'twitter',
            'insta',

          ]
        })
        if (!details) {
          return res.json({ message: 'No student/teacher details found', details: details });
        }
        // console.log("details of student", details)
       if(details.instituteId){
        const institution = await DBMODELS.institutions.findByPk(details.instituteId, {
          attributes: ['institution_name'],
        });
    
    
        const currentTeacherDetails = {
          ...details.get({ plain: true }),
          institution_name: institution.institution_name,
        };
    
        res.json(currentTeacherDetails);
       }else{
        res.json(details)
       }
      } catch (error) {
        res.status(500).json({ error: 'Error fetching institutes: ' + error.message });
      }
}

const getInstituteDetail = async(req,res)=>{
    const {id} = req.params
    try {
        const institutes = await DBMODELS.institutions.findByPk(id,{
          attributes: ['first_name',"middle_name", "last_name","id","institution_name", 'logo'],
        })
        res.json(institutes)
      } catch (error) {
        res.status(500).json({ error: 'Error fetching institutes: ' + error.message });
      }
}



// all club-institute routes

const getAllClubInstitute = async(req,res)=>{
  console.log("this is institute");
  try {
    const institute = await DBMODELS.club_institutes.findAll()
    return res.status(200).json(institute);
  } catch (error) {
    return res.status(500).json({message:"Error fetching", error:error.message})
  }
}

const createClubInstitute = async (req, res) => {
  const body = req.body;
  // if(!body.clubId){
  //   return res.status(400).json({message:'you have to pass clubId in body'})
  // }
  
  const newClubId = body.clubId;
  try {
    const club_institute = await DBMODELS.club_institutes.create(body);

    let currentClubInstitute = await DBMODELS.club_institutes.findByPk(club_institute.id);

    let allClubs = currentClubInstitute.all_clubs; 

    if (newClubId && !allClubs.includes(newClubId)) {
      allClubs = [...allClubs, newClubId]
      await currentClubInstitute.update({ all_clubs: allClubs });
    }
    return res.status(200).json(currentClubInstitute);
  } catch (error) {
    res.status(500).json({ message: "failed to create club-institutes", error: error.message });
  }
};


const updateClubInstituteById = async (req, res) => {
  const {id} = req.params;
  const body = req.body;
  if(!body.clubId){
    return res.status(400).json({message:'you have to pass clubId'})
  }
  const newClubId = body.clubId
  try {
    const club_institute = await DBMODELS.club_institutes.findByPk(id);
    let allClubs = club_institute.all_clubs;
    
    if(newClubId && !allClubs.includes(newClubId)){
      allClubs = [...allClubs, newClubId]
      await club_institute.update({all_clubs:allClubs})
    }else{
      console.log("inside else")
      allClubs = allClubs.filter(id=>id !== newClubId)
      await club_institute.update({all_clubs:allClubs})
    }
    return res.status(200).json(club_institute)
    
  } catch (error) {
    return res.status(500).json({ message: "failed to update club-institutes", error: error.message });
  }
};



const getClubInstituteById = async (req, res) => {
  const {id} = req.params;
  
  try {
    const club_institute =await DBMODELS.club_institutes.findByPk(id)

    res.status(200).json(club_institute);
  } catch (error) {
    res.status(500).json({ message: "failed to get club-institutes", error: error.message });
  }
};

// all club-students routes

const getAllClubStudent = async(req,res)=>{
  console.log("this is institute");
  try {
    const student = await DBMODELS.club_students.findAll()
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({message:"Error fetching", error:error.message})
  }
}

const createClubStudent = async (req, res) => {
  const body = req.body;
  // if(!body.clubId){
  //   return res.status(400).json({message:'you have to pass clubId in body'})
  // }
  
  const newClubId = body.clubId;
  try {
    const club_institute = await DBMODELS.club_students.create(body);

    let currentClubInstitute = await DBMODELS.club_students.findByPk(club_institute.id);

    let allClubs = currentClubInstitute.all_clubs; 

    if (newClubId && !allClubs.includes(newClubId)) {
      allClubs = [...allClubs, newClubId]
      await currentClubInstitute.update({ all_clubs: allClubs });
    }
    return res.status(200).json(currentClubInstitute);
  } catch (error) {
    res.status(500).json({ message: "failed to create club-institutes", error: error.message });
  }
};



const updateClubStudentById = async (req, res) => {
  const {id} = req.params;
  const body = req.body;
  if(!body.clubId){
    return res.status(400).json({message:'you have to pass clubId'})
  }
  const newClubId = body.clubId
  try {
    const club_institute = await DBMODELS.club_students.findByPk(id);
    let allClubs = club_institute.all_clubs;
    
    if(newClubId && !allClubs.includes(newClubId)){
      allClubs = [...allClubs, newClubId]
      await club_institute.update({all_clubs:allClubs})
    }else{
      console.log("inside else")
      allClubs = allClubs.filter(id=>id !== newClubId)
      await club_institute.update({all_clubs:allClubs})
    }
    return res.status(200).json(club_institute)
    
  } catch (error) {
    return res.status(500).json({ message: "failed to update club-institutes", error: error.message });
  }
};



const getClubStudentById = async (req, res) => {
  const {id} = req.params;
  
  try {
    const club_institute =await DBMODELS.club_students.findByPk(id)

    res.status(200).json(club_institute);
  } catch (error) {
    res.status(500).json({ message: "failed to get club-institutes", error: error.message });
  }
};

// getAllPostFromUser

const getAllPostFromUser = async(req, res)=>{
  const {userId, userType} = req.params
  try {
    const posts= await DBMODELS.posts.findAll({
      where:{
        userId,
        userType,
        type:'club'
      },
      order: [['createdAt', 'DESC']]
    })
     console.log("posts", posts)
    if(!posts){
      return res.status(404).json({message:"No post found"})
    }

    for(let i = 0 ; i<posts.length; i++){
     

      let postUserDetail
    if (['student', 'teacher'].includes(posts[i].userType)) {
      postUserDetail = await DBMODELS.students.findByPk(posts[i].userId,{
        attributes:[
          "id",
        "first_name",
        "middle_name",
        "last_name",
        "instituteId",
        "profile",
        ]
      });
      console.log("postUserDetail", postUserDetail)
    } else if (posts[i].userType === 'institute') {
      postUserDetail = await DBMODELS.institutions.findByPk(posts[i].userId,{
        attributes:[
          "id",
        "first_name",
        "middle_name",
        "last_name",
        "institution_name",
        "logo",
        ]
      });
    }

    const allComments = await DBMODELS.comments.count({
      where: {
        postId:posts[i].id,
        
      },
    },{
      attributes:[
        'id',
        'userId',
        'commentType',
        'userType',
        'postId',
        'userRole',
        'image',
        'content',
        'createdAt',
        'updatedAt',
        
      ]
    });
    
    const CommentsCount = allComments;
    const allLikes = posts[i].likes;
    const likesCount = allLikes.length;
    const isLoading = true
    posts[i] = {...posts[i].dataValues,CommentsCount,allLikes,
      likesCount,postDetail:posts[i],
      postUserDetail,isLoading
      
    }

    }
    return res.status(200).json({message:"success", allPosts:posts});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}
const getAllPostFromUserNew = async(req, res)=>{
  const {instituteId, userType} = req.params
  console.log(instituteId)
  try {
    const posts= await DBMODELS.posts.findAll({
      where:{
        instituteId,
        // userType,
        // type:'club'
      },
      attributes:[
        'id','type','userType','postBy','content',
        'instituteId','userId','clubId','youTubeLink','youTubeId','likes','image','logo','createdAt',
        [sequelize.literal(`(
          select json_object(
            'id', id,
            'type', type,
            'userType', userType,
            'postBy', postBy,
            'content', content,
            'instituteId', instituteId,
            'userId', userId,
            'clubId', clubId,
            'youTubeLink', youTubeLink,
            'youTubeId', youTubeId,
            'image', image,
            'logo', logo,
            'likes', likes,
            'createdAt', createdAt,
            'updatedAt', updatedAt
          )
          FROM DUAL
          
        )`),'postDetail'],
        [sequelize.literal(`(
          COALESCE (
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'institution_name', institution_name,
                'logo', logo
                
              )
              FROM institutions
              where institutions.id =  posts.userId and posts.userType='institute'
              
            ),
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'instituteId', instituteId,
                'profile', profile
                
              )
              FROM students
              where students.id =  posts.userId 
            )
          )
        )`),'postUserDetail'],
        [sequelize.literal(`(
          select count(*) 
          from comments
          where postId=posts.id
        )`),'CommentsCount'],
        [sequelize.literal(`(
          SELECT COALESCE(JSON_LENGTH(likes), 0) as totalLikes
         from dual
        )`), 'likesCount'],
        [sequelize.literal(`(
          SELECT likes
          from dual
        )`), 'allLikes'],
        [sequelize.literal('true'), 'isLoading']
      ],
      order: [['createdAt', 'DESC']]
    })
   
    return res.status(200).json({message:"success", allPosts:posts});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

const getAllPostOfSingleUser = async(req, res)=>{
  const {userId, userType} = req.params
  console.log(userId, userType)
  try {
    const posts= await DBMODELS.posts.findAll({
      where:{
        userId,
        userType,
        // type:'club'
      },
      attributes:[
        'id','type','userType','postBy','content',
        'instituteId','userId','clubId','youTubeLink','youTubeId','likes','image','logo','createdAt',
        [sequelize.literal(`(
          select json_object(
            'id', id,
            'type', type,
            'userType', userType,
            'postBy', postBy,
            'content', content,
            'instituteId', instituteId,
            'userId', userId,
            'clubId', clubId,
            'youTubeLink', youTubeLink,
            'youTubeId', youTubeId,
            'image', image,
            'logo', logo,
            'likes', likes,
            'createdAt', createdAt,
            'updatedAt', updatedAt
          )
          FROM DUAL
          
        )`),'postDetail'],
        [sequelize.literal(`(
          COALESCE (
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'institution_name', institution_name,
                'logo', logo
                
              )
              FROM institutions
              where institutions.id =  posts.userId and posts.userType='institute'
              
            ),
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'instituteId', instituteId,
                'profile', profile
                
              )
              FROM students
              where students.id =  posts.userId 
            )
          )
        )`),'postUserDetail'],
        [sequelize.literal(`(
          select count(*) 
          from comments
          where postId=posts.id
        )`),'CommentsCount'],
        [sequelize.literal(`(
          SELECT COALESCE(JSON_LENGTH(likes), 0) as totalLikes
         from dual
        )`), 'likesCount'],
        [sequelize.literal(`(
          SELECT likes
          from dual
        )`), 'allLikes'],
        [sequelize.literal('true'), 'isLoading']
      ],
      order: [['createdAt', 'DESC']]
    })
   
    return res.status(200).json({message:"success", allPosts:posts});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

const getAllPostFromInstituteRelated = async(req, res)=>{
  const {instituteId} = req.params
  try {
    const posts= await DBMODELS.posts.findAll({
      where:{
        instituteId
      },
      attributes:[
        'id','type','userType','postBy','content',
        'instituteId','userId','clubId','youTubeLink','youTubeId','likes','image','logo','createdAt',
        [sequelize.literal(`(
          select json_object(
            'id', id,
            'type', type,
            'userType', userType,
            'postBy', postBy,
            'content', content,
            'instituteId', instituteId,
            'userId', userId,
            'clubId', clubId,
            'youTubeLink', youTubeLink,
            'youTubeId', youTubeId,
            'image', image,
            'logo', logo,
            'likes', likes,
            'createdAt', createdAt,
            'updatedAt', updatedAt
          )
          FROM DUAL
          
        )`),'postDetail'],
        [sequelize.literal(`(
          COALESCE (
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'institution_name', institution_name,
                'logo', logo
                
              )
              FROM institutions
              where institutions.id =  posts.userId and posts.userType='institute'
              
            ),
            (
              select json_object(
                'id', id,
                'first_name', first_name,
                'last_name', last_name,
                'instituteId', instituteId,
                'profile', profile
                
              )
              FROM students
              where students.id =  posts.userId 
            )
          )
        )`),'postUserDetail'],
        [sequelize.literal(`(
          select count(*) 
          from comments
          where postId=posts.id
        )`),'CommentsCount'],
        [sequelize.literal(`(
          SELECT COALESCE(JSON_LENGTH(likes), 0) as totalLikes
         from dual
        )`), 'likesCount'],
        [sequelize.literal(`(
          SELECT likes
          from dual
        )`), 'allLikes'],
        [sequelize.literal('true'), 'isLoading']
      ],
      order: [['createdAt', 'DESC']]
    })
   
    return res.status(200).json({message:"success", allPosts:posts});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

// get all images of club user for profile
const getAllImagesFromUserPost = async(req,res)=>{
  const {userId, userType} = req.params
  try {
    let allImages = []
    const allPost = await DBMODELS.posts.findAll({
      where:{
        userId,
        userType,
      },
      order: [['createdAt', 'DESC']]
    })
    if(!allPost){
      return res.status(404).json({message:"No Post Found"})
    }

    for(let i=0; i<allPost.length;i++){
      if(allPost[i].image){
        allImages.push(allPost[i].image)
      }
    }

    return res.status(200).json({message:"success", result:allImages})
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}


// fetch post all detail

const getPostDetailById = async (req, res) => {
  const { postId } = req.params;

  try {
    let postDetail = await DBMODELS.posts.findByPk(postId,{
      attributes:[
        'id',
        'type',
        'userType',
        'content',
        'instituteId',
        'userId',
        'clubId',
        'youTubeId',
        'youTubeLink',
        'image',
        'createdAt',
        'updatedAt',
        'likes'
      ]
    });
    if (!postDetail) {
      return res.json({ message: 'No post with this id' });
    }
    let postUserDetail
    if (['teacher', 'student'].includes(postDetail.userType) ) {
      postUserDetail = await DBMODELS.students.findByPk(postDetail.userId,{
        attributes:[
          "id",
        "first_name",
        "middle_name",
        "last_name",
        "instituteId",
        "profile",
        ]
      });
    } else if (postDetail.userType === 'institute') {
      postUserDetail = await DBMODELS.institutions.findByPk(postDetail.userId,{
        attributes:[
          "id",
        "first_name",
        "middle_name",
        "last_name",
        "institution_name",
        "logo",
        ]
      });
    }
    const allComments = await DBMODELS.comments.count({
      where: {
        postId,
        
      },
    });

    // const populatedComments = [];

    // for (const comment of allComments) {
    //   let userDetail;
    //   if (comment.userRole === 'student') {
    //     userDetail = await DBMODELS.students.findByPk(comment.userId,{
    //       attributes:[
    //         "id",
    //       "first_name",
    //       "middle_name",
    //       "last_name",
    //       "instituteId",
    //       "profile",
    //       ]
    //     });
    //   } else if (comment.userRole === 'institute') {
    //     userDetail = await DBMODELS.institutions.findByPk(comment.userId,{
    //       attributes:[
    //         "id",
    //       "first_name",
    //       "middle_name",
    //       "last_name",
    //       "institution_name",
    //       "logo",
    //       ]
    //     });
    //   }

    //   populatedComments.push({
    //     ...comment.toJSON(),
    //     userDetail: userDetail.toJSON(),
    //   });
    // }

    const CommentsCount = allComments;
    const allLikes = postDetail.likes;
    const likesCount = allLikes.length;
    const isLoading = true
    postDetail = {...postDetail.dataValues,
      postUserDetail,
      // allComments:populatedComments,
      CommentsCount,
      allLikes,
      likesCount,
      isLoading}
    res.status(200).json({
      post:postDetail
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getUserDetailClub = async(req,res)=>{
  const {userId, role} = req.params
  try {
    const user = role==='institute'? await DBMODELS.institutions.findByPk(userId)
                                    :await DBMODELS.students.findByPk(userId);

    if(!user){
      return res.json({message:'no user found '})
    }
    if((user.role==='student' || user.role==='teacher') && user.instituteId){
      const institution = await DBMODELS.institutions.findByPk(user.instituteId,{
        attributes:['institution_name']
      });
      
      const currentUser = {
        ...user.dataValues,institution_name:institution.institution_name, role:role
      }
      return res.status(200).json({message:'success', user:currentUser})
    }
    return res.status(200).json({message:'success', user:{...user.dataValues,role:role}})
  } catch (error) {
      return res.status(500).json({message:error.message})
  }
}

const clubProfileEditDetail  = async (req,res)=>{
  const {userId,userType} = req.params;
  
  const body = req.body;
  console.log("this is req.body", req.body)
  try {
    let profile = {}
    if(userType ==='institute'){
     profile = await DBMODELS.club_institutes.findByPk(userId)
    }else{

      profile = await DBMODELS.club_students.findByPk(userId)
    }
    if(!profile){
      return res.json({message:"No user found "});
    }
    console.log("boddyyyyyyyyyyyyy", body)
    const updatedProfile = await profile.update(body);
    res.status(200).json({message:"successfully update", profile:updatedProfile})

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

const clubUserDetail = async(req,res)=>{
  const {userId, userType} = req.params;
  try {
    const user = userType==='institute'?await DBMODELS.club_institutes.findByPk(userId) 
                                      : await DBMODELS.club_students.findByPk(userId)
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({message:'success', user})
  } catch (error) {
    return res.json({message:error.message})
  }
}

  const getAllLikedPostByUserId = async(req,res)=>{
    const {userId} = req.params;
    
    try {
      const allPosts = await DBMODELS.posts.findAll({
        where:{
          // type: 'club',
          likes: sequelize.literal(`JSON_CONTAINS(likes, '[${parseInt(userId)}]')`)
        },
        order:[['createdAt', 'DESC']]
      })
      
      if(!allPosts){
        return res.status(400).json({message:"NO liked post "})
      }

      
      return res.status(200).json({message:'fetch succesfully', result:allPosts})
    } catch (error) {
        res.json(error.message)
    }
  }

  const getAllUserCommentByUserId = async(req,res)=>{
    const {userId} = req.params;

    try {
      const allComments = await DBMODELS.comments.findAll({
        where:{
          userId,
          commentType:'club'
        },
        order:[
          ['createdAt','DESC']
        ]
      })
      if(!allComments){
        return res.status(403).json({message:'no comment found'})
      }
      return res.status(200).json({
        message:'successfully fetched',
        results:allComments,
      })
    } catch (error) {
      return res.json(error.message)
    }
  }

  const checkUserExist = async (req,res)=>{
    const {userId, type} = req.params;
    let answer  = false;
    try {
        if(type==='institute'){
          let user = await DBMODELS.club_institutes.findByPk(userId)
          if(user){
            answer = true;
            return res.status(200).json({result:answer})
          }
        }else if(type==='student' || type==='teacher'){
          let user = await DBMODELS.club_students.findByPk(userId)
          if(user){
            answer = true;
            return res.status(200).json({result:answer})
          }
        }
        return res.status(200).json({result:answer})
    } catch (error) {
        return res.json({error:error.message})
    } 
  }

  const updateLikePost = async(req,res)=>{
    const {postId, userId} = req.params;
    const userIdNumber = Number(userId);
    try {
      let post  = await DBMODELS.posts.findByPk(postId);
      if(!post){
        return res.status(403).json({message:"no post found"})
      }
      let updatedLikes ;
      if(post.likes.includes(userIdNumber)){
          updatedLikes = post.likes.filter(id=> id !==userIdNumber)
      }
      else {
        updatedLikes = [...post.likes, userIdNumber];
      }
      await post.update({likes:updatedLikes})
      return res.status(200).json({message:'likes updated',likes:updatedLikes})
     
    } catch (error) {
      return res.status(500).json({message:error.message})
    }
  }

  const updateComment = async(req,res)=>{
    const {postId} = req.params;
    const body = req.body;

    try {
      let comment = await DBMODELS.comments.create(body)
      let userDetail;
      if (comment.userRole === 'student' || comment.userRole === 'teacher') {
        userDetail = await DBMODELS.students.findByPk(comment.userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "instituteId",
          "profile",
          ]
        });
        // console.log("userDetail", userDetail)
      } else if (comment.userRole === 'institute') {
        userDetail = await DBMODELS.institutions.findByPk(comment.userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "institution_name",
          "logo",
          ]
        });
      }
      let commentCount = await DBMODELS.comments.count({
        where:{
          postId
        }
      })
      let newComment = {...comment.toJSON(),userDetail:userDetail.toJSON() }
      res.status(200).json({message:'successaaaaa', newComment, commentCount})
    } catch (error) {
      res.status(500).json({message:error.message});
    }
  }

  const getClubPostByClubId = async(req,res)=>{
    const {clubId} = req.params
    try {
      let posts = await DBMODELS.posts.findAll({
        where:{
          clubId
        },
        order:[['createdAt', 'DESC']]
      })
  
      for(let i = 0 ; i<posts.length; i++){
        
        if (!posts[i]) {
          console.log("no post with id ", posts[i].id)
        }
  
        let postUserDetail
      if ( ['teacher', 'student'].includes(posts[i].userType) ) {
        postUserDetail = await DBMODELS.students.findByPk(posts[i].userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "instituteId",
          "profile",
          ]
        });
      } else if (posts[i].userType === 'institute') {
        postUserDetail = await DBMODELS.institutions.findByPk(posts[i].userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "institution_name",
          "logo",
          ]
        });
      }
  
      const allComments = await DBMODELS.comments.count({
        where: {
          postId:posts[i].id,
        },
      });
      
      const CommentsCount = allComments;
      const allLikes = posts[i].likes;
      const likesCount = allLikes.length;
      const isLoading = true;
      posts[i] = {...posts[i].dataValues,CommentsCount,allLikes,
        likesCount,postUserDetail,isLoading
      }
  
      }
  
      res.status(200).json({posts})
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

  const getCommentClubPost = async(req,res)=>{
    const {postId} = req.params;

    try {
      const allComments = await DBMODELS.comments.findAll({
        where:{
          postId,
          
        },
        order:[
          ['createdAt','DESC']
        ]
      },{
        attributes:[
          'id',
          'userId',
          'commentType',
          'userType',
          'postId',
          'userRole',
          'image',
          'content',
          'createdAt',
          'updatedAt',
          
        ]
      })
      let populatedComments =[]

      for (let comment of allComments){
        let userDetail;
        if (comment.userRole === 'student' || comment.userRole === 'teacher') {
          userDetail = await DBMODELS.students.findByPk(comment.userId,{
            attributes:[
              "id",
            "first_name",
            "middle_name",
            "last_name",
            "instituteId",
            "profile",
            ]
          });
        } else if (comment.userRole === 'institute') {
          userDetail = await DBMODELS.institutions.findByPk(comment.userId,{
            attributes:[
              "id",
            "first_name",
            "middle_name",
            "last_name",
            "institution_name",
            "logo",
            ]
          });
        }
        populatedComments.push({
          ...comment.toJSON(),
          userDetail: userDetail.toJSON(),
        });
      }

      res.status(200).json({message:'success', allComment:populatedComments})

    } catch (error) {
      res.status(500).json({
        error:error.message
      })
    }
  }

  const updateClubPost = async(req,res)=>{
    const {postId, userId} = req.params;
    const body = req.body;
    try {
      let postDetail = await DBMODELS.posts.findByPk(postId,{
        attributes:[
          'id',
          'type',
          'userType',
          'content',
          'instituteId',
          'userId',
          'clubId',
          'youTubeId',
          'youTubeLink',
          'image',
          'createdAt',
          'updatedAt',
          'likes'
        ]
      });

      if (!postDetail) {
        return res.json({ message: 'No post with this id' });
      }
      let updatedPost = body;
      if (req.file) {
        if (postDetail.image) {
          // s3deleteObject(postDetail.image);
          updatedPost.image = req.file?.Location;
        }
        else{
          updatedPost.image = req.file?.Location
        }

      }

      await postDetail.update(updatedPost)
      // console.log("newe|||||||||||", updatedPost)
      // console.log("newe|||||||||||", body, "chekcdkd")
     res.status(200).json({postDetail:updatedPost});
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

  // create club post

  const createClubPost = async(req,res)=>{
    const {pageType} = req.query;
    if(pageType==='profile'){
      var {userId} = req.params;
    }
    else if(pageType==='club'){
      var {clubId} = req.params;
    }
    let body = req.body;
    body.image = req.file?.Location
    if(!body.content && !body.youTubeLink){
      return res.status(400).json({error:'Content is Required'})
    }
    try {

      const post = await DBMODELS.posts.create(body);
      
      let posts=[]
      if(pageType==='profile'){
        posts = await DBMODELS.posts.findAll({
          where:{
            userId,
            type:'club'
          },
          order:[['createdAt', 'DESC']]
        })
      }
      else if(pageType==='club'){
        posts = await DBMODELS.posts.findAll({
          where:{
            clubId,
            type:'club'
          },
          order:[['createdAt', 'DESC']]
        })
      }

      for(let i = 0 ; i<posts.length; i++){
        
        if (!posts[i]) {
          console.log("no post with id ", posts[i].id)
        }
  
        let postUserDetail
      if (['teacher', 'student'].includes(posts[i].userType) )
       {
        postUserDetail = await DBMODELS.students.findByPk(posts[i].userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "instituteId",
          "profile",
          ]
        });
      } else if (posts[i].userType === 'institute') {
        postUserDetail = await DBMODELS.institutions.findByPk(posts[i].userId,{
          attributes:[
            "id",
          "first_name",
          "middle_name",
          "last_name",
          "institution_name",
          "logo",
          ]
        });
      }
  
      const allComments = await DBMODELS.comments.count({
        where: {
          postId:posts[i].id,
        },
      });
      
      const CommentsCount = allComments;
      const allLikes = posts[i].likes;
      const likesCount = allLikes.length;
      const isLoading = true;
      posts[i] = {...posts[i].dataValues,CommentsCount,allLikes,
        likesCount,postUserDetail,isLoading
      }
  
      }
      // allPost = [post,...allPost]
      res.status(200).json({message:'success',posts})

    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

  // Get all Blogs
  const getAllBlogs = async (req,res)=>{
    try {
      allBlogs = await DBMODELS.blogs.findAll()
      if(!allBlogs){
        return res.status(403).json({message:'No Blogs Found fetched'})
      }
      return res.status(200).json({message:'fetched all blogs', results:allBlogs})
    } catch (error) {
      return res.status(500).json({message:error.message})
    }
  }

const getRecentActivity = async (req, res) => {
  try {
    const allCommentDetail = await DBMODELS.comments.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['postId', 'userId', 'content','createdAt',
        [
          sequelize.literal(`COALESCE((SELECT CONCAT(st.first_name, ' ', st.last_name) FROM students AS st 
                              LEFT JOIN comments AS c ON st.id = c.userId  WHERE (c.userType = 'student' OR c.userType = 'teacher') AND c.postId = comments.postId
                              LIMIT 1), 
                              (SELECT i.institution_name 
                              FROM institutions AS i 
                              LEFT JOIN comments AS c ON i.id = c.userId 
                              WHERE c.userType = 'institute' AND c.postId = comments.postId
                              LIMIT 1))`),
          'commentBy'
        ],
        [
          sequelize.literal(`COALESCE((SELECT st.profile
                            FROM students AS st 
                            LEFT JOIN comments AS c ON st.id = c.userId 
                            WHERE (c.userType = 'student' OR c.userType = 'teacher') AND c.postId = comments.postId
                            LIMIT 1), 
                            (SELECT i.logo 
                            FROM institutions AS i 
                            LEFT JOIN comments AS c ON i.id = c.userId 
                            WHERE c.userType = 'institute' AND c.postId = comments.postId
                            LIMIT 1))`),
          'profile'
        ],
        [
          sequelize.literal(`COALESCE((SELECT CONCAT(st.first_name, ' ', st.last_name)
                          FROM students AS st 
                          LEFT JOIN posts AS p ON st.id = p.userId 
                          WHERE (p.userType = 'student' OR p.userType = 'teacher') AND p.id = comments.postId
                          LIMIT 1), 
                          (SELECT i.institution_name 
                          FROM institutions AS i 
                          LEFT JOIN posts AS p ON i.id = p.userId 
                          WHERE p.userType = 'institute' AND p.id = comments.postId
                          LIMIT 1))`),
          'postBy'
        ],
        [
          sequelize.literal(`(
            select clubId from posts where posts.id = comments.postId
          )`),
          'clubId'
        ],
        [sequelize.literal("'comment'"), 'actionType'],
        [sequelize.col('commentType'),'type'],


      ],

      where: {
        [Op.or]: [
          { userType: 'student' },
          { userType: 'teacher' },
          { userType: 'institute' }
        ]
      }


    })

  const allPostDetails = await DBMODELS.posts.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5,
    attributes:['id','type','createdAt','clubId','userId',
    [
      sequelize.literal(`COALESCE(
        (SELECT profile FROM students WHERE students.id = posts.userId AND posts.userType IN ('teacher', 'student') LIMIT 1), 
        (SELECT logo FROM institutions WHERE institutions.id = posts.userId AND posts.userType = 'institute' LIMIT 1)
      )`),
      'profile'
    ],
    [
      sequelize.literal(`COALESCE(
        (SELECT CONCAT(first_name, ' ', last_name) FROM students WHERE students.id = posts.userId AND posts.userType IN ('teacher', 'student') LIMIT 1), 
        (SELECT institution_name FROM institutions WHERE institutions.id = posts.userId AND posts.userType = 'institute' LIMIT 1)
      )`),
      'name'
    ],
    [sequelize.literal("'post'"), 'actionType'],
    [sequelize.col('id'),'postId'],
    
  ]
  })
  const manageData = [...allCommentDetail, ...allPostDetails];
manageData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({
      message: "Data Found.",
      manageData
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error?.message,
    })
  }
}

module.exports = {
  getAllPostFromUserNew,
  getAllPostOfSingleUser,
  getAllPostFromInstituteRelated,
  getAllBlogs, // get all blogs
  createClubPost, // create club post
  updateClubPost,
  getCommentClubPost,
  updateComment,
  updateLikePost,
  getAllImagesFromUserPost,
  checkUserExist,
  getAllUserCommentByUserId,
  getAllLikedPostByUserId,
  clubUserDetail,
  clubProfileEditDetail,
  getUserDetailClub,
  getAllPostFromUser,//get all post from userId  => club Profile
  getClubPostByClubId, // get all clubpost by clubId => club Post
  getPostDetailById, // get post detail by postId => single Post
  getAllFollowedClubByUser,
  getAllClubInstitute,
  getClubInstituteById,
  updateClubInstituteById,
    getAllpublicClub,
    createClubInstitute,
    createClub,
    getAllClubs,
    getClubById,
    deletePrivateClubByInstituteId,
    deleteClub,
    getPrivateClubByInstituteId,
    updateClubById,
    getInstituteDetail,
    getStudentDetail,
    getClubStudentById,
    updateClubStudentById,
    createClubStudent,
    getAllClubStudent,
    getRecentActivity
}