const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");
const { s3deleteObject } = require("../../aws/s3ObjectFunctions");

//get current institute Details (if admin )
const currentInstituteDetails = async (req, res) => {
  try {
    const { instituteId } = req.body;
    const details = await DBMODELS.institutions.findByPk(instituteId, {
      attributes: ['first_name', "middle_name", "last_name", "id", "institution_name", 'logo', "district", "state", "email", "institution_address"],
    });
    if (!details) {
      return res.json({ message: "no institute found", detail: details })
    }
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching institutes: ' + error.message });
  }
}
//get current Teacher
const currentTeacherDetails = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const details = await DBMODELS.students.findByPk(teacherId, {
      attributes: ['first_name',
        'last_name',
        'email',
        'gender',
        'instituteId',
        'address',
        'profile',
        'role',
      ]
    })
    if (!details) {
      return res.json({ message: 'No teacher details found', details: details });
    }
    if (details.instituteId) {
      const institution = await DBMODELS.institutions.findByPk(details.instituteId, {
        attributes: ['institution_name'],
      });


      const currentTeacherDetails = {
        ...details.get({ plain: true }),
        institution_name: institution.institution_name,
      };

      res.json(currentTeacherDetails);
    } else {
      res.json(details)
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching institutes: ' + error.message });
  }
}

//Get all Institute 
const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await DBMODELS.institutions.findAll({
      attributes: ['first_name', "middle_name", "last_name", "id", "institution_name", 'logo'],
    })
    res.json(institutes)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching institutes: ' + error.message });
  }
}


// Create a new post


const createPost = async (req, res) => {
  // const {  content,likes,instituteId,postBy,logo } = req.body;

  // updated 
  let body = req.body ;
  body.image = req.file?.Location
  if (!body.content && !body.youTubeLink) {
    return res.status(400).json({ error: '  content are required' });
  }
  
  try {
    const post = await DBMODELS.posts.create(body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post: ' + error.message });
  }
};
// like a post

const postLikeByNormalUser = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "not a logged in user" })
    }
    const post = await DBMODELS.posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "post not found for like" });
    }
    let updatedLikes;
    if(post.likes.includes(userId)){
      updatedLikes = post.likes.filter(id=>id !==userId);
    }
    else {

      updatedLikes = [...post.likes, userId];
    }
    await post.update({ likes: updatedLikes });
    res.json({ message: "post saved succesfully", post: post });;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await DBMODELS.posts.findAll({
      order: [['createdAt', 'DESC']],
      where:{
        type:'timeline',
      }
    });

    if (posts.length === 0) {
      return res.json(posts);
    }

    // const reversedPosts = posts.reverse();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving posts: ' + error.message });
  }
};

// Get a specific post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await DBMODELS.posts.findByPk(id);
    if (!post) {
      res.status(404).json(post);
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving post: ' + error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, likes, image, youTubeId, youTubeLink } = req.body;
  try {
    if (!content) {
      return res.json("please add a content")
    }
    const post = await DBMODELS.posts.findByPk(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      if (req.file) {
        if (post.image) {
          s3deleteObject(post.image);

          post.image = req.file?.Location;
        }

      }
      post.content = content;
      // post.likes = likes;
      post.youTubeLink = youTubeLink;
      post.youTubeId = youTubeId;
      await post.save();
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating post: ' + error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await DBMODELS.posts.findByPk(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      if (post.image) {
        s3deleteObject(post.image);
      }
      await post.destroy();
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post: ' + error.message });
  }
};
// Create a new comment
const createComment = async (req, res) => {
  try {
    let body = req.body;
    if (!body.content) {
      return res.status(500).json("invalid")
    }
    const comment = await DBMODELS.comments.create(body);
    const post = await DBMODELS.posts.findByPk(body.postId)
    post.commentsCount = post.commentsCount + 1;
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment: ' + error.message });
  }
};

// Get all comments for a post
const getAllCommentsForPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await DBMODELS.comments.findAll({ where: { postId } });
    // if (comments.length === 0) {
    //   return res.json({message:"no post for this ", comments:comments});
    // }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving comments: ' + error.message });
  }
};
const getAllComments = async (req, res) => {
  // const { postId } = req.params;
  try {
    const comments = await DBMODELS.comments.findAll();
    // if (comments.length === 0) {
    //   return res.json({message:"no post for this ", comments:comments});
    // }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving comments: ' + error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await DBMODELS.comments.findByPk(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
    } else {
      comment.content = content;
      await comment.save();
      res.json(comment);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating comment: ' + error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.body;

  try {
    const post = await DBMODELS.posts.findByPk(postId);
    if (!post) {
      return res.status(403).json({ message: "no post here" });
    }
    const comment = await DBMODELS.comments.findByPk(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
    } else {
      await comment.destroy();
      post.commentsCount = post.commentsCount - 1;
      if (post.commentsCount < 0) {
        post.commentsCount = 0;
      }
      await post.save();
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment: ' + error.message });
  }
};



module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  getAllCommentsForPost,
  updateComment,
  deleteComment,
  getAllComments,
  getAllInstitutes,
  currentInstituteDetails,
  currentTeacherDetails,
  postLikeByNormalUser,
};