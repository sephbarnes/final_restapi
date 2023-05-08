

const verifyStates = (req, res) => {
    var states = require('../model/statesData.json'); 
    function getUpperCode(code) {
        return 
    }
    var sCode = req.params.code;
    const reqState = sCode.toUpperCase();
    console.log(reqState);


    const stateCodes = states.filter(req => req.code).map(element => element.code);
    console.log(stateCodes);
    
    stateCodes.forEach((value, key) => {
        if (value != req.code) {
            return false
        }
    })
    return true;
};

module.exports = verifyStates;