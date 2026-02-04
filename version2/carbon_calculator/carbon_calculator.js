const {DBMODELS} = require("../../database/models/init-models");

const carBonCalculatorTransport = async(req, res) => {
    const {residentialArea,
    typeofVehicle,
    fuelType,
    fuelEfficiency,
    distance,
    frequency,
    domesticFlights,
    internationalFlights,
    numberofDomesticFlights,
    averageDomesticDistance,
    numberofInterFlights,
    averageInternationalDistance,
    calculateValue } = req.body
    try {
        
        if(residentialArea === "Urban"){
            const fuelConsumptionUrban = (distance * frequency * 2 ) / fuelEfficiency;
                const transportCalculator = await DBMODELS.carbonFootprint_Transportation.create({
                    residentialArea,
                    typeofVehicle,
                    fuelType,
                    fuelEfficiency,
                    distance,
                    frequency,
                    domesticFlights,
                    internationalFlights,
                    numberofDomesticFlights,
                    averageDomesticDistance,
                    numberofInterFlights,
                    averageInternationalDistance,
                    calculateValue : fuelConsumptionUrban
                })
                if(transportCalculator){
                return res.status(201).json({msg : "Successfully calculate annual fuel consumption (Urban)"})
                }
            }
            else if(residentialArea === "Rural"){
                const fuelConsumptionRural = (distance * frequency * 2 ) / fuelEfficiency 
                const ruraltransportCalculator = await DBMODELS.carbonFootprint_Transportation.create({
                    residentialArea,
                    typeofVehicle,
                    fuelType,
                    fuelEfficiency,
                    distance,
                    frequency,
                    domesticFlights,
                    internationalFlights,
                    numberofDomesticFlights,
                    averageDomesticDistance,
                    numberofInterFlights,
                    averageInternationalDistance,
                    calculateValue : fuelConsumptionRural
                })

                if(ruraltransportCalculator){
                return res.status(201).json({msg : "Successfully calculate annual fuel consumption (Rural)"})
                }
            }
            else{
                return res.status(500).json({msg : "Fill your data"})
            }
    } catch (error) {
        return res.status(500).json({msg : "Server Error Occured", error})
    }
}


module.exports = {
    carBonCalculatorTransport
}