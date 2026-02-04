/*  
   === Auto Assign Delegates Functionality =========
 */


const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");

async function AutoAssignHandler(req, res) {
  const institute = req.user;
  const DelegatesAssigned = req.body;
  if (institute && DelegatesAssigned?.length) {
    try {
      DelegatesAssigned?.forEach((element, index) => {
        DBMODELS.g20_delegates.update(
          { track: element?.track, theme: element?.theme, cntry: element?.country, desig: element?.designation },
          {
            where: {
              id: element?.delegateId,
            },
          }
        );
      });
      DBMODELS.institutions.update(
        { isAssigned: "true" },
        {
          where: {
            id: institute?.id,
          },
        }
      );
      res.status(200).json({ message: "Successfully Auto Assigned the Track, Theme, Country and Designation" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ message: "Invalid Request" });
  }
}
module.exports = {
  AutoAssignHandler,
};
