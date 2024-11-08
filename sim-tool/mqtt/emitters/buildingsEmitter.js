const topics = require('../topics')
const {publishMessage} = require('../publish')
const {publishBuildings} = require('../services/buildingsService') //Rename controllers to services
let intervalId = null


module.exports.updateBuildingsInfo = async function updateBuildingsInfo(client) {
   
    intervalId = setInterval(() => {
        publishBuildings(client)
        console.log("in interval")
    }, 60000)
    
}

module.exports.stopBuildingsEmitter = function stopBuildingsEmitter() {
    if (intervalId) {
        clearInterval(intervalId);
        console.log("Stopped buildings emitter");
    }
}