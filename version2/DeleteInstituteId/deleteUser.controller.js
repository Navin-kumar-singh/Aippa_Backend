const { DBMODELS } = require("../../database/models/init-models");

const findFromReg = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institute_reg_details.findOne({
      where: {
        email,
      },
    });
    if (detailsFound) {
      return res.status(200).json({
        id: detailsFound.id,
        email: detailsFound.email,
        message: "Email Found Successfully!!",
      });
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const findFromRegister = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institute_register.findOne({
      where: {
        email,
      },
    });
    if (detailsFound) {
      return res.status(200).json({
        id: detailsFound.id,
        email: detailsFound.email,
        message: "Email Found Successfully!!",
      });
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const findFromInstitute = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institutions.findOne({
      where: {
        email,
      },
    });
    if (detailsFound) {
      return res.status(200).json({
        id: detailsFound.id,
        email: detailsFound.email,
        message: "Email Found Successfully!!",
      });
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const deleteFromReg = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institute_reg_details.findOne({
      where: {
        email,
      },
    });
    const {
      affiliate_id,
      institution_name,
      institution_address,
      logo,
      first_name,
      middle_name,
      last_name,
      district,
      state,
      pincode,
      emailDB,
      contact,
      password,
    } = detailsFound;
    if (detailsFound) {
      console.log("Details: ", detailsFound);
      const emailExist = await DBMODELS.institute_backup.findOne({
        where: {
          email,
        },
      });
      if (emailExist) {
        // return res.status(409).json({
        //     message:'Data already exist in Backup!!',
        // });
        console.log("Data already exist in Backup!!");
      } else {
        const backupData = await DBMODELS.institute_backup.upsert({
          affiliate_id: affiliate_id,
          institution_name: institution_name,
          institution_address: institution_address,
          password: password,
          logo: logo,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          district: district,
          state: state,
          pincode: pincode,
          email: emailDB,
          contact: contact,
        });
        if (backupData) {
          console.log("Data Back Up Done Successfully!!");
          console.log("Backup Data: ", backupData);
        } else {
          return res.status(402).json({
            message: "Failed to Back Up Data!!",
          });
        }
      }
      const dataDeleted = await DBMODELS.institute_reg_details.destroy({
        where: {
          email,
        },
      });
      if (dataDeleted) {
        return res.status(200).json({
          message: "Email Deleted Successfully!!",
        });
      } else {
        return res.status(401).json({
          message: "Some problem occured while deleting data!!",
        });
      }
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const deleteFromRegister = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institute_register.findOne({
      where: {
        email,
      },
    });
    const {
      affiliate_id,
      institution_name,
      institution_address,
      logo,
      first_name,
      middle_name,
      last_name,
      district,
      state,
      pincode,
      emailDB,
      contact,
      password,
    } = detailsFound;
    if (detailsFound) {
      const emailExist = await DBMODELS.institute_backup.findOne({
        where: {
          email,
        },
      });
      if (emailExist) {
        // return res.status(409).json({
        //     message:'Data already exist in Backup!!',
        // });
        console.log("Data already exist in Backup!!");
      } else {
        const backupData = await DBMODELS.institute_backup.upsert({
          affiliate_id: affiliate_id,
          institution_name: institution_name,
          institution_address: institution_address,
          password: password,
          logo: logo,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          district: district,
          state: state,
          pincode: pincode,
          email: emailDB,
          contact: contact,
        });
        if (backupData) {
          console.log("Data Back Up Done Successfully!!");
          console.log("Backup Data: ", backupData);
        } else {
          return res.status(402).json({
            message: "Failed to Back Up Data!!",
          });
        }
      }
      const dataDeleted = await DBMODELS.institute_register.destroy({
        where: {
          email,
        },
      });
      if (dataDeleted) {
        return res.status(200).json({
          message: "Email Deleted Successfully!!",
        });
      } else {
        return res.status(401).json({
          message: "Some problem occured while deleting data!!",
        });
      }
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const deleteFromInstitute = async (req, res) => {
  try {
    const { email } = req.body;
    const detailsFound = await DBMODELS.institutions.findOne({
      where: {
        email,
      },
    });
    const {
      affiliate_id,
      institution_name,
      institution_address,
      logo,
      first_name,
      middle_name,
      last_name,
      district,
      state,
      pincode,
      emailDB,
      contact,
      password,
    } = detailsFound;
    if (detailsFound) {
      const emailExist = await DBMODELS.institute_backup.findOne({
        where: {
          email,
        },
      });
      if (emailExist) {
        // return res.status(409).json({
        //     message:'Data already exist in Backup!!',
        // });
        console.log("Data already exist in Backup!!");
      } else {
        const backupData = await DBMODELS.institute_backup.upsert({
          affiliate_id: affiliate_id,
          institution_name: institution_name,
          institution_address: institution_address,
          password: password,
          logo: logo,
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          district: district,
          state: state,
          pincode: pincode,
          email: emailDB,
          contact: contact,
        });
        if (backupData) {
          console.log("Data Back Up Done Successfully!!");
          console.log("Backup Data: ", backupData);
        } else {
          return res.status(402).json({
            message: "Failed to Back Up Data!!",
          });
        }
      }
      const dataDeleted = await DBMODELS.institutions.destroy({
        where: {
          email,
        },
      });
      if (dataDeleted) {
        return res.status(200).json({
          message: "Email Deleted Successfully!!",
        });
      } else {
        return res.status(401).json({
          message: "Some problem occured while deleting data!!",
        });
      }
    } else {
      return res.status(400).json({
        message: "No Such Email Found!!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  findFromReg,
  findFromRegister,
  findFromInstitute,
  deleteFromReg,
  deleteFromRegister,
  deleteFromInstitute,
};
