const { mysqlcon } = require("../../model/db");
const { DBMODELS } = require("../../database/models/init-models");
const sequelize = require("../../database/connection");

const profileDetails = async (req,res)=>{
    const {userId, role} = req.params
    try {
        let userDetail = role==='institute'?await DBMODELS.institutions.findOne({
            where:{
                id:userId
            },attributes:['id',
                'institution_name','bio','logo',
                'email','contact','status',
                'createdAt','fb',
                [sequelize.literal(`'institute'`),'role'],
                'insta','lkd','twitter','ytb',
                [sequelize.literal(`(
                 COALESCE(
                  ( select concat(street,' ',city)
                  from institute_reg_details 
                  where institute_reg_details.institute_id=institutions.id),
                  (
                    select institution_address
                    from dual
                  )
                 )
                )`),'institution_address'],
                [sequelize.literal(`(
                  select count(*)
                  from students where students.instituteId=institutions.id and students.role='student'
                )`),'totalStudent'],
                [sequelize.literal(`(
                  select count(*)
                  from students where students.instituteId=institutions.id and students.role='teacher'
                )`),'totalTeacher'],
                [sequelize.literal(`(
                  select website
                  from institute_reg_details where institute_reg_details.institute_id=institutions.id
                )`),'website']
                
            ]
        }):
        await DBMODELS.students.findOne({
            where:{
                id:userId
            },
            attributes:['id',
                'first_name','last_name','father_name','instituteId',
                'address','email','contact','resume','status','profile',
                'dob','gender','role','createdAt',
                [sequelize.literal(`(
                    SELECT institution_name
                    FROM institutions as i
                    WHERE i.id = students.instituteId
                )`)
                    ,'institution_name',],
                [sequelize.literal(`(
                    COALESCE(
                        (
                            SELECT JSON_UNQUOTE(JSON_EXTRACT(srd.curriculum, '$.course')) as course
                            FROM student_reg_details as srd
                            where srd.student_id = students.id
                        ),
                        (
                            SELECT class 
                            FROM student_onboard as so
                            where so.studentId = students.id
                        )

                    )
                )`), 'class'],
                [sequelize.literal(`(
                   COALESCE(
                    (
                      SELECT achievements
                      FROM student_reg_details
                      where student_reg_details.student_id= students.id
                    ),
                    (
                      SELECT achievements
                      FROM teacher_reg_details
                      where teacher_reg_details.student_id= students.id
                    )
                   )
                )`), 'achievements'],
                [sequelize.literal(`(
                    COALESCE(
                      (
                      SELECT activities
                      FROM student_reg_details
                      where student_reg_details.student_id= students.id
                      ),
                     ( SELECT activities
                    FROM teacher_reg_details
                    where teacher_reg_details.student_id= students.id
                    )
                    )
                )`),'activities'],[sequelize.literal(`(
                  COALESCE(
                    (
                    SELECT interests
                    FROM student_reg_details
                    where student_reg_details.student_id= students.id
                    ),
                   ( SELECT interests
                  FROM teacher_reg_details
                  where teacher_reg_details.student_id= students.id
                  )
                  )
              )`),'interests'],[sequelize.literal(`(
                COALESCE(
                  (
                  SELECT experience
                  FROM student_reg_details
                  where student_reg_details.student_id= students.id
                  ),
                 ( SELECT experience
                FROM teacher_reg_details
                where teacher_reg_details.student_id= students.id
                )
                )
            )`),'experience'],[sequelize.literal(`(
              COALESCE(
                (
                SELECT achievements
                FROM student_reg_details
                where student_reg_details.student_id= students.id
                ),
               ( SELECT achievements
              FROM teacher_reg_details
              where teacher_reg_details.student_id= students.id
              )
              )
          )`),'achievements'],[sequelize.literal(`(
            COALESCE(
              (
              SELECT website
              FROM student_reg_details
              where student_reg_details.student_id= students.id
              ),
             ( SELECT website
            FROM teacher_reg_details
            where teacher_reg_details.student_id= students.id
            )
            )
        )`),'website'],[sequelize.literal(`(
          COALESCE(
            (
            SELECT facebook_acc
            FROM student_reg_details
            where student_reg_details.student_id= students.id
            ),
           ( SELECT facebook_acc
          FROM teacher_reg_details
          where teacher_reg_details.student_id= students.id
          )
          )
      )`),'fb'],[sequelize.literal(`(
        COALESCE(
          (
          SELECT twitter_acc
          FROM student_reg_details
          where student_reg_details.student_id= students.id
          ),
         ( SELECT twitter_acc
        FROM teacher_reg_details
        where teacher_reg_details.student_id= students.id
        )
        )
    )`),'twitter'],
    [sequelize.literal(`(
      COALESCE(
        (
        SELECT linkedin_acc
        FROM student_reg_details
        where student_reg_details.student_id= students.id
        ),
       ( SELECT linkedin_acc
      FROM teacher_reg_details
      where teacher_reg_details.student_id= students.id
      )
      )
  )`),'lkd'],
  [sequelize.literal(`(
    COALESCE(
      (
      SELECT insta_acc
      FROM student_reg_details
      where student_reg_details.student_id= students.id
      ),
     ( SELECT insta_acc
    FROM teacher_reg_details
    where teacher_reg_details.student_id= students.id
    )
    )
)`),'insta'],
[sequelize.literal(`(
  COALESCE(
    (
    SELECT youtube_acc
    FROM student_reg_details
    where student_reg_details.student_id= students.id
    ),
   ( SELECT youtube_acc
  FROM teacher_reg_details
  where teacher_reg_details.student_id= students.id
  )
  )
)`),'ytb']
            ]
        })
        if(!userDetail){
            return res.json({
                message:'No user found'
            })
        }
        function calculateProfileCompletion(userObject,requiredKeys) {
            const presentKeys = requiredKeys.filter(key => {
                if (Array.isArray(userObject[key])) {
                    return userObject[key].length > 0;
                } else {
                    return userObject[key] !== null && userObject[key] !== undefined;
                }
            }).length;
            const completionPercentage = (presentKeys / requiredKeys.length) * 100;
            return Math.round(completionPercentage);
          }
          let profilePercentage = 0;
        if(role==='institute'){
            const requiredKeys = ['institution_name', 'institution_address', 'bio', 'logo',
             'email',
             'contact'
            ];
            profilePercentage = calculateProfileCompletion(userDetail.dataValues, requiredKeys)
        }else{
            const requiredKeys = ['first_name','last_name',
            'email','contact','resume','status','profile',
            'dob','gender','role','class','achievements','activities',
            'experience',
           ];
           profilePercentage = calculateProfileCompletion(userDetail.dataValues, requiredKeys)
        }
        userDetail = {...userDetail.toJSON(), profilePercentage}
        return res.json({
            userDetail,

        })

    } catch (error) {
        return res.json(error.message)
    }
}
const createClubPost = async(req,res)=>{
    
    
  let body = req.body;
  console.log(body)
  body.image = req.file?.Location
  if(!body.content && !body.youTubeLink){
    return res.status(400).json({error:'Content is Required'})
  }
  try {
    const post = await DBMODELS.posts.create(body);
    
    let posts=[]
   
      posts = await DBMODELS.posts.findAll({
        where:{
          userId:body.userId,
        },
        order:[['createdAt', 'DESC']]
      })
    
    
    for(let i = 0 ; i<posts.length; i++){
      
      if (!posts[i]) {
        console.log("no post with id ", posts[i].id)
      }

      let postUserDetail
        if (['student', 'teacher'].includes(posts[i].userType) ) {
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
  

module.exports = { 
    profileDetails,
    createClubPost,
};