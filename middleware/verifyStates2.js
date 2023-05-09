//Checks if the state code is a real statecode
//returns uppercase, verified statecode as res
const states2 = require('../model/statesData.json');

const verifyStates2 = (req, res) => {
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states2.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //find if the statecode is a real state
    for (s in stateCodes) { //stateRes becomes true/false
        if(s == "undefined" || stateCode == "undefined") {
            return res.status(400).json({ 'message': 'get state: not a real state'
        });} 
        else  if(s == stateCode) {   
            res.code = stateCode;
            return res.code
        }
    };    
};

module.exports = verifyStates2;