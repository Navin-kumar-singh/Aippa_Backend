function temp(req,res){
    const file = req.file
    res.status(200).json({message:"Data saved",file})
}
module.exports = temp 