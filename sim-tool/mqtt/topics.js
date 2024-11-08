const { privateDecrypt } = require("crypto")

module.exports.settingsPostRequest = "service/demo/settings/post/request"
module.exports.settingsPostResponse = "service/demo/settings/post/response"
module.exports.startSimulation = "service/demo/start"
module.exports.stopSimulation = "service/demo/stop"
module.exports.simulationStatus = "service/demo/status"
module.exports.buildings = "service/demo/buildings"


module.exports.addNewBuilding = function addNewBuilding(buildingName){

    return `service/demo/buildings/${buildingName}`

}

//rename to generate eos topic
module.exports.generateBuildingTopic = function generateBuildingTopic(buildingName, floor, office, eos){

    return `${buildingName}/${floor}/office/${office}/eos/${eos}/status`;
    
}

//TODO: Make so that you can create topics based on device type - so create also enum for device types.
/*module.exports.generateDeviceSubTopics = function generateDeviceTopicSubTopics(buildingName, floor, office, device){ 

    if(device.type = ){

    }

}*/

//TODO: MAKE ONE METHOD FOR CREATING SENSOR TOPIC AND CREATE BASE SENSOR TOPIC


module.exports.generateEOSTopics = function generateEOSTopics(buildingName, floor, office, eos){
    
    const topicsArray = []
    const baseTopic = `${buildingName}/${floor}/office/${office}/eos/${eos}`

    // Sensor topics
    const lightSensorTopic = generateLightSensorTopic(baseTopic)
    const temperatureTopic = generateTemperatureSensorTopic(baseTopic)
    const uptimeTopic = generateUptimeSensorTopic(baseTopic)
    const humidityTopic = generateHumiditySensorTopic(baseTopic)
    const macAdressTopic = generate_MAC_WiFi_Adress_SensorTopic(baseTopic)
    const wifiStrengthTopic = generate_WiFi_Signal_SensorTopic(baseTopic)
    const bssidTopic = generate_BSSID_SensorTopic(baseTopic)
    const ipAddressTopic = generate_IP_Adress_SensorTopic(baseTopic)
    const ssidTopic = generate_SSID_SensorTopic(baseTopic);
    const binarySensorTopic = generateBinarySensorTopic(baseTopic);

    topicsArray.push(lightSensorTopic)
    topicsArray.push(temperatureTopic)
    topicsArray.push(uptimeTopic)
    topicsArray.push(humidityTopic)
    topicsArray.push(macAdressTopic)
    topicsArray.push(wifiStrengthTopic)
    topicsArray.push(bssidTopic)
    topicsArray.push(ipAddressTopic)
    topicsArray.push(ssidTopic)
    topicsArray.push(binarySensorTopic)

    return topicsArray

}

module.exports.generateOfficeLightsTopics = function generateOfficeLightsTopics(buildingName, floor, office, group){ 
    const topicsArray = []
    const baseTopic = `${buildingName}/${floor}/office/${office.name}/lights/status` 

    const groupStatusTopic = generateLightGroupStatusTopic(baseTopic, group)

    topicsArray.push(groupStatusTopic)

    return topicsArray
}

function generateLightGroupStatusTopic(baseTopic, group){
    const groupName = group.friendlyName; // Get the group name from the friendly name
    const lastTwoDigits = String(groupName).slice(-2); // Get the last two digits of the group name
    console.log("LAST TWO DIGITS")
    console.log(lastTwoDigits)
    return `${baseTopic}/${lastTwoDigits}`; //string in state
}

module.exports.generateSateraitoTopics = function generateSateraitoTopics(buildingName, floor, sateraito){ //add office later on
    const baseTopic = `${buildingName}/sateraito/${floor}/${sateraito}/bridge`
    const officeTopic = `${buildingName}/sateraito/${floor}/${sateraito}/office`
    const topicsArray = []

    const stateTopic = generateSateraitoStateTopic(baseTopic)
    const devicesTopic = generateSateraitoDevicesTopic(baseTopic)
    const groupsTopic = generateSateraitoGroupsTopic(baseTopic)

    topicsArray.push(stateTopic)
    topicsArray.push(devicesTopic)
    topicsArray.push(groupsTopic)
    topicsArray.push(officeTopic)

    return topicsArray
}

//Sateraito Topics

function generateSateraitoStateTopic(baseTopic){
    return `${baseTopic}/state`; //string in state
}

function generateSateraitoDevicesTopic(baseTopic){
    return `${baseTopic}/devices`; //string in state
}

function generateSateraitoGroupsTopic(baseTopic){
    return `${baseTopic}/groups`; //string in state
}

//Sensor Topics
function generateLightSensorTopic(baseTopic){
    return `${baseTopic}/sensor/light/state`; //float in state
}

function generateTemperatureSensorTopic(baseTopic){
    return `${baseTopic}/sensor/temperature/state`; //float in state
}

function generateUptimeSensorTopic(baseTopic){
    return `${baseTopic}/sensor/uptime/state`; // int in state
}

function generateHumiditySensorTopic(baseTopic){
    return `${baseTopic}/sensor/humidity/state`; // float in state
}

function generate_MAC_WiFi_Adress_SensorTopic(baseTopic){
    return `${baseTopic}/sensor/mac_wifi_adress/state`; // string in state
}

function generate_WiFi_Signal_SensorTopic(baseTopic){
    return `${baseTopic}/sensor/wifi_signal/state`; // int in state
}

function generate_BSSID_SensorTopic(baseTopic){
    return `${baseTopic}/sensor/connected_bssid/state`; // string in state
}

function generate_IP_Adress_SensorTopic(baseTopic){
    return `${baseTopic}/sensor/ip_address/state`; // string in state 
}

function generate_SSID_SensorTopic(baseTopic){
    return `${baseTopic}/sensor/connected_ssid/state`; // string in state (microlabIoT, Microlab, prob enum)
}

function generateBinarySensorTopic(baseTopic){
    return `${baseTopic}/sensor/binary_sensor/pir/state`; // string in state
}

//Switch topics