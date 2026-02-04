/* Add Poll on students page */



const { mysqlcon } = require("../../model/db");
const logg = require("../../utils/utils");


/* 
Functionality: createPoll add data of students poll.
*/

function createPoll(req, res) {
    const { question, options } = req.body
    mysqlcon.query(`INSERT INTO poll_questions(poll_ques,options) VALUES ('${question}','${options}');`, (err, result) => {
        if (err) {
            logg.error(err)
        } else {
            res.status(200).json({ message: "Data Saved!!", result })
        }
    })
}

module.exports = { createPoll }