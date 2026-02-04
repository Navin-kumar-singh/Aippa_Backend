const { Op } = require("sequelize");
const sequelize = require("../../database/connection");
const { DBMODELS } = require("../../database/models/init-models");
const moment = require('moment');

/* Functinality:- It will be use to get Data of Today registered Institutes and Students & Total Institutes and Total Students */
async function getDataAnalytics(req, res) {
    const getTotalCertifications = async (role) => {
        const query = `
        SELECT COUNT(*) AS totalCertifications
        FROM certificates AS c
        INNER JOIN students AS s ON c.studentId = s.id
        WHERE s.role = '${role}';
      `;
        const [results] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, raw: true });
        return results?.totalCertifications;
    };
    try {
        const totalStudents = await DBMODELS.students.count({ where: { role: 'student' } });
        const totalStudentsToday = await DBMODELS.students.count({ where: { role: 'student', createdAt: { [Op.gte]: moment().startOf('day').toDate() } } }); const totalActiveStudents = await DBMODELS.students.count({ where: { role: 'student', status: 'active' } });
        const totalTeachers = await DBMODELS.students.count({ where: { role: 'teacher' } });
        const totalTeachersToday = await DBMODELS.students.count({ where: { role: 'teacher', createdAt: { [Op.gte]: moment().startOf('day').toDate() } } }); const totalActiveTeachers = await DBMODELS.students.count({ where: { role: 'teacher', status: 'active' } });
        const totalInstitutions = await DBMODELS.institutions.count();
        const totalInstitutionsToday = await DBMODELS.institutions.count({ where: { createdAt: { [Op.gte]: moment().startOf('day').toDate() } } });
        const totalActiveInstitutions = await DBMODELS.institutions.count({ where: { status: 'active' } });
        const totalCourseEnrolled = await DBMODELS.course_enrolled.count();
        const totalCertificationsStudents = await getTotalCertifications('student')
        const totalCertificationsTeachers = await getTotalCertifications('teacher')
        const analyticsData = {
            totalStudents,
            totalStudentsToday,
            totalActiveStudents,
            totalTeachers,
            totalTeachersToday,
            totalActiveTeachers,
            totalInstitutions,
            totalInstitutionsToday,
            totalActiveInstitutions,
            totalCourseEnrolled,
            totalCertificationsStudents,
            totalCertificationsTeachers,
        };

        res.json({ message: "fetched Analytics Data", result: analyticsData });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'An error occurred while fetching analytics.' });
    }
}

async function getUsersPerDayForChart(req, res) {
    try {
        const dates = [];
        const studentData = [{
            name: "new student",
            data: [],
        },
        {
            name: "Active student",
            data: [],
        }];
        const teacherData = [{
            name: "New Teacher",
            data: []
        },
        {
            name: "Active Teacher",
            data: []
        }];
        const instituteData = [{
            name: "New Institutions",
            data: []
        },
        {
            name: "Active Institutions",
            data: []
        }];
        const certificateData = [{
            name: "New Certifications",
            data: []
        },
        {
            name: "Course Enrollments",
            data: []
        }];

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date(todayEnd);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const currentDay = new Date(sevenDaysAgo);
        while (currentDay <= todayEnd) {
            const startOfDay = new Date(currentDay);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(currentDay);
            endOfDay.setHours(23, 59, 59, 999);
            // Fetch data for registered students
            const registeredStudents = await DBMODELS.students.findAll({
                where: {
                    role: 'student',
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Fetch data for active students
            const activeStudents = await DBMODELS.students.findAll({
                where: {
                    role: 'student',
                    status: 'active',
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Fetch data for registered teachers
            const registeredTeachers = await DBMODELS.students.findAll({
                where: {
                    role: 'teacher',
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Fetch data for active teachers
            const activeTeachers = await DBMODELS.students.findAll({
                where: {
                    role: 'teacher',
                    status: 'active',
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Fetch data for registered institutions
            const registeredInstitutions = await DBMODELS.institutions.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Fetch data for active institutions
            const activeInstitutions = await DBMODELS.institutions.findAll({
                where: {
                    status: 'active',
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            const certifications = await DBMODELS.certificates.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            const enrollments = await DBMODELS.course_enrolled.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });
            // Calculate the counts for each category
            dates.push(moment(currentDay.toISOString()).format('DD MMM'));
            studentData[0].data.push(registeredStudents.length);
            studentData[1].data.push(activeStudents.length);
            teacherData[0].data.push(registeredTeachers.length);
            teacherData[1].data.push(activeTeachers.length);
            instituteData[0].data.push(registeredInstitutions.length);
            instituteData[1].data.push(activeInstitutions.length);
            certificateData[0].data.push(certifications.length);
            certificateData[1].data.push(enrollments.length);
            // Move to the next day
            currentDay.setDate(currentDay.getDate() + 1);
        }
        res.json([
            { title: "Students Analytics", dates, data: studentData },
            { title: "Teachers Analytics", dates, data: teacherData },
            { title: "Institute Analytics", dates, data: instituteData },
            { title: "Certificates", dates, data: certificateData }
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
}


module.exports = {
    getDataAnalytics,
    getUsersPerDayForChart
}