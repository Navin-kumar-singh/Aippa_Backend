const { DBMODELS } = require("../../database/models/init-models")


const postHighlights = async(req, res)=>{
    try {
        const createHighlights = await DBMODELS.highlights.create(req.body);
        if(createHighlights){
            return res.status(201).json({msg: "Created successfully", createHighlights})
        }
        else{
            return res.status(404).json({msg: "Not Created"})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Server Error', error: error.message})
    }
}

const getHighlights = async(req, res)=>{
    try {
        const fetchHighlights = await DBMODELS.highlights.findAll();
        if(fetchHighlights.length > 0){
            return res.status(200).json({msg: 'Get successfully', fetchHighlights})
        }
        else{
            return res.status(404).json({msg: 'No data'})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Server Error', error: error.message})
    }
}

const updateHighlightsData = async(req, res)=>{
    const {highlightId} = req.params
    try {
        const updateHighlights = await DBMODELS.highlights.update(req.body,{
            where: {
                id: highlightId
            }
        })
        if(updateHighlights){
            return res.status(200).json({msg: 'Update successfully', updateHighlights})
        }
        else{
            return res.status(404).json({msg: 'No data'})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Server Error', error: error.message})
    }
}

const deleteHighlightsData = async(req, res)=>{
    const {highlightId} = req.params
    try {
        const deleteHighlights = await DBMODELS.highlights.destroy({
            where: {
                id: highlightId
            }
        })
        if(deleteHighlights){
            return res.status(200).json({msg: 'Delete successfully', deleteHighlights})
        }
        else{
            return res.status(404).json({msg: 'No data'})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Server Error', error: error.message})
    }
}


module.exports= {
    postHighlights,
    getHighlights,
    updateHighlightsData,
    deleteHighlightsData
}