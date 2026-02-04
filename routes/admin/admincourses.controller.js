
/*
Course functionalities for Admin
-Add Course 
-Add Course's sections -
-Add section's Videos  
-Fetch course 
-Fetch Admin Course's Section
*/

const e = require("express");
const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

/*
Functionality: postAdminCourses is adding a new course to the courses table.
*/

async function PostAdminCourses(req, res) {
    const { course_name, slug, desc, status, author } = req.body;
    try {
        if (course_name && slug && desc && status && author && req?.file) {
            const result = await DBMODELS.courses.create({
                course_name, slug, desc, status, author, thumbnail: req?.file?.Location
            })

            return res.status(200).json({ success: true, message: "Data Posted Sucessfully", result: result })
        } else {
            res.status(409).json({
                success: false, message: "All the Fields are required"
            })
        }
    } catch (err) {
        logg.error(err)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

/*
Functionality: editAdminCourses updates a course according to course's .Id
*/


async function editAdminCourses(req, res) {
    const { course_name, slug, desc, status, author, id } = req.body;
    try {
        if (course_name && slug && desc && status && author) {
            const result = await DBMODELS.courses.update({
                course_name, slug, desc, status, author, thumbnail: req?.file?.Location
            }, {
                where: {
                    id: id
                }
            })

            return res.status(200).json({ success: true, message: "Data Updated Sucessfully", result: result })
        } else {
            return res.status(409).json({
                success: false, message: "All the Fields are required"
            })
        }
    } catch (err) {
        logg.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

/*
Functionality: deleteAdminCourses deletes a course according to course's .Id
*/

async function deleteAdminCourses(req, res) {
    const { id } = req.query
    try {
        if (id) {

            const result = await DBMODELS.courses.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({ success: true, message: "Data Deleted Sucessfully" })
        } else {
            return res.status(409).json({
                success: false, message: "Couldn't Find Id"
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}


/*
Functionality: postAdminCoursesSection is adding a section to the courses according to courseId
*/
async function PostAdminCoursesSection(req, res) {
    const { title, description, status, courseId } = req.body;
    try {
        if (title && description && status && courseId) {
            const result = await DBMODELS.sections.create({
                title, description, status, courseId
            })

            return res.status(200).json({ success: true, message: "Data Posted Sucessfully", result: result })
        } else {
            res.status(409).json({
                success: false, message: "All the Fields are required"
            })
        }
    } catch (err) {
        logg.error(err)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

/*
Functionality: editAdminCoursesSection is updating section of courses according to section's Id.
*/


async function editAdminCoursesSection(req, res) {
    const { title, description, status, courseId, id } = req.body;
    try {
        if (title && description && status && courseId) {
            const result = await DBMODELS.sections.update({
                title, description, status, courseId
            }, {
                where: {
                    id: id
                }
            })

            return res.status(200).json({ success: true, message: "Data updated Sucessfully" })
        } else {
            res.status(409).json({
                success: false, message: "All the Fields are required"
            })
        }
    } catch (err) {
        logg.error(err)
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}


/*
Functionality: deleteAdminCoursesSection deletes sections of courses according to section's Id.
*/

async function deleteAdminCoursesSection(req, res) {
    const { id } = req.query
    try {
        if (id) {

            const result = await DBMODELS.sections.destroy({
                where: {
                    id: id
                }
            })
            return res.status(200).json({ success: true, message: "Data Deleted Sucessfully" })
        } else {
            return res.status(409).json({
                success: false, message: "Couldn't Find Id"
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}

/*
Functionality: PostAdminCoursesSectionVideo is adding videos to sections of courses according to sectionId.
*/
async function PostAdminCoursesSectionVideo(req, res) {
    const { title, sectionId, path, type, status } = req.body;
    try {
        if (title && sectionId && path && type && status) {
            const result = await DBMODELS.video_documents.create({
                title, sectionId, path, sectionId, type
            })

            return res.status(200).json({ success: true, message: "Data Posted Sucessfully", result: result })
        } else {
            res.status(409).json({
                success: false, message: "All the Fields are required"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server error"
        })
    }
}


/*
Functionality: getAdminCoursesSectionVideo is fetching videos according to sectionId.
*/
async function getAdminCoursesSectionVideo(req, res) {
    const { id } = req.query;
    try {
        const result = await DBMODELS.video_documents.findAll({
            where: {
                sectionId: id
            }
        })
        return res.status(200).json({ success: true, message: "Data Fetched Sucessfully", result: result })
    } catch (err) {
        logg.error(err);
    }
}

/*
Functionality: getAdminCourses is fetching all courses.
*/
async function getAdminCourses(req, res) {
    const { id } = req.query;
    try {
        const result = await DBMODELS.courses.findAll();
        return res.status(200).json({ success: true, message: "Data Fetched Sucessfully", result: result })
    } catch (err) {
        logg.error(err);
    }
}


/*
Functionality: getAdminCoursesSections is fetching a section according to courseId.
*/
async function getAdminCoursesSections(req, res) {
    const { id } = req.query;
    try {
        const result = await DBMODELS.sections.findAll({
            where: {
                courseId: id
            }
        });
        return res.status(200).json({
            success: true, message: "Data Fetched Sucessfully", result: result
        })
    } catch (err) {
        logg.error(err);
    }
}

module.exports = { PostAdminCourses, editAdminCourses, deleteAdminCourses, PostAdminCoursesSection, editAdminCoursesSection, deleteAdminCoursesSection, PostAdminCoursesSectionVideo, getAdminCoursesSectionVideo, getAdminCourses, getAdminCoursesSections }


