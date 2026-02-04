const { DBMODELS } = require("../../database/models/init-models");

const getAllStudentTeacher =async(req, res)=> {
    const  {instituteId} = req.params;
    try {
        const allStudents = await DBMODELS.students.findAll( {where : {
            role : "student",
            instituteId
        }})
        const allTeachers = await DBMODELS.students.findAll({where : {
            role : "teacher",
            instituteId
        }})

        return res.status(200).json({msg : "Get all teacher and student", allStudents, allTeachers})
    } catch (error) {
        return res.status(500).json({msg : "Server error"}, error.message)
    }
} 

module.exports= {
    getAllStudentTeacher
}