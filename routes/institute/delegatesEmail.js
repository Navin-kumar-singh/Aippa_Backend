/*
  ===== Delegates Email Processing ====
  - Update New Delegates 
  - Send Emails processing for Delegates 
 */

const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");
var f = false;
// var delegaetsList = new Set([]);

async function emailDelegates(list) {
  await DBMODELS.delegatesEmailProcessing.bulkCreate(list);
  f = true;
}


setInterval(() => {
  if (f) {
    DBMODELS.delegatesEmailProcessing
      .findAll({
        raw: true,
      })
      .then((result) => {
        if (result.length) {
          tempList = result.slice(-10);
          tempList.map((student) => {
            DBMODELS.delegatesEmailProcessing.destroy({
              where: {
                id: student.id,
              },
            });
          });
        } else {
          f = false;
        }
      })
      .catch((error) => {
        logg.error(error);
      });
  }
}, 60000);

module.exports = { emailDelegates };

