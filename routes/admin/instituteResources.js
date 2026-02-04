/* 
Admin resources
-Get the institute resources data by institute 
-add institute resources data by institute  
-update institute resources data by institute  
-delete institute resources data by institute
*/


const { DBMODELS } = require("../../database/models/init-models");
const logg = require("../../utils/utils");


/* 
Functionality: getResources function fetch the resources from institute_resources according to InstituteId.
*/

async function getResources(req, res) {
    const { id } = req.params;
    logg.error({ id })
    if (id) {


        try {
            const data = await DBMODELS.institute_resources.findAll({
                where: {
                    instituteId: id
                }
            });
            res.status(200).json({
                message: "Fetched All Resources", result: data
            })
        } catch (error) {
            logg.error(error);
            res.status(500).json({

                message: "Internal Server Srror"
            })
        }
    } else {
        res.status(404).json({
            message: "Data Not Found"
        })
    }


}


/* 
Functionality: postResources function add the resources data to institute_resources.
*/

async function postResources(req, res) {
    const { id } = req.params;
    const { resource_link, title } = req.body;
    if (id, req?.file?.location) {
        try {
            const data = await DBMODELS.institute_resources.create({
                title, resource_link, resource_file: req.file.location, instituteId: id, createdAt: new Date(), updatedAt: new Date()
            });
            res.status(200).json({ message: "Data Posted Sucessfully", result: data })
        } catch (error) {
            logg.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    } else {

        res.status(404).json({
            message: "Data Not Found"
        })
    }
}


/* 
Functionality: updateResources function update the resources data in institute_resources according to id.
*/

async function updateResources(req, res) {

    const { resource_link, title, id } = req.body;
    logg.error(req?.file?.location)
    if (id) {
        try {
            if (req?.file?.location) {
                const data = await DBMODELS.institute_resources.update({
                    title, resource_link, resource_file: req.file.location, updatedAt: new Date()
                }, {
                    where: {
                        id: id
                    }
                });
                res.status(200).json({ message: "Data Updated Sucessfully", result: data })
            } else {
                const data = await DBMODELS.institute_resources.update({
                    title, resource_link, updatedAt: new Date()
                }, {
                    where: {
                        id: id
                    }
                });
                res.status(200).json({ message: "Data Updated Sucessfully", result: data })
            }

        } catch (error) {
            logg.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    } else {

        res.status(404).json({

            message: "Data Not Found"
        })
    }
}


/* 
Functionality: deleteResources function dalete the resources data from institute_resources according to id.
*/

async function deleteResources(req, res) {
    const { id } = req.query;
    logg.error(req.body);
    if (id) {
        try {
            const data = await DBMODELS.institute_resources.destroy({ where: { id } });
            res.status(200).json({
                message: "Data Deleted Succesfully",
                result: data
            })
        } catch (error) {
            logg.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
    else {
        res.status(404).json({
            message: "Data Not Found"
        })
    }

}

module.exports = { getResources, postResources, updateResources, deleteResources }


