const { publishMessage } = require('../publish'); // Import the publishMessage function
const fs = require('fs');
const path = require('path');
const topics = require('../topics')
const {Building} = require('../../dist/building')

// Path to the buildings.json file
const buildingsFilePath = path.resolve(__dirname, '../../data/buildings.json');

// Function to read buildings from the buildings.json file
function getBuildings() {
    if (!fs.existsSync(buildingsFilePath)) {
      console.log("no path")
      return [];
    }
    const data = fs.readFileSync(buildingsFilePath, 'utf-8');
    return JSON.parse(data);
  }

// Function to find and return a building by name
function getBuildingByName(buildingName) {
  const buildings = getBuildings()

  return buildings.find((b) => b.name === buildingName);
}

  // Function to publish each building
function publishBuildings(client) {
    const buildings = getBuildings(); // Read the buildings from the JSON file
  
    console.log(buildings)
    
    buildings.forEach((building) => {
      const buildingTopic = topics.addNewBuilding(building.name)
      const message = building; // Use the building object as the message
  
      // Publish the building to its specific topic
      publishMessage(client, buildingTopic, message,false); 
      console.log(`Published building: ${building.building} to topic: ${buildingTopic}`);
    });
  }

   // Function to save the updated buildings list back to the JSON file
function saveBuilding(newBuilding) {
    const buildings = getBuildings();

    buildings.push(newBuilding)

    fs.writeFileSync(buildingsFilePath, JSON.stringify(buildings, null, 2), 'utf-8'); //move to buildings service 
    console.log("Saved building to db: Currently local json")
  }

function buildingExists(buildingName) {
    console.log("IN BUILDING EXISTS")
    const buildings = getBuildings()
    const exists = buildings.some((b) => b.name === buildingName);
    console.log(exists)
    return exists
  }

// Function to update a building
function updateBuilding(updatedBuilding) {
  const buildings = getBuildings();

  const buildingIndex = buildings.findIndex((b) => b.name === updatedBuilding.name);
  if (buildingIndex === -1) {
    console.error(`Building ${updatedBuilding.name} not found!`);
    return false; // Building not found
  }

  // Update the building data
  buildings[buildingIndex] = updatedBuilding;

  // Save the updated buildings array back to the JSON file
  fs.writeFileSync(buildingsFilePath, JSON.stringify(buildings, null, 2), 'utf-8');
  console.log(`Updated building ${updatedBuilding.name} in the database.`);
  return true; // Update successful
}

function createNewBuilding(buildingName, numOfFloors, officesPerFloor, eosPerOffice, lights, sateraitos){
  if(buildingExists(buildingName)){
    console.log(`Building with the name ${buildingName} already exists!`)
    return false //maybve later throw exception 
  }
  console.log("IN CREATE NEW BUILDING")
  console.log(`Floors requested: ${numOfFloors}`)
  console.log(buildingName)
  const building = new Building(buildingName, buildingName, numOfFloors, officesPerFloor, eosPerOffice, sateraitos, lights)
  console.log("COUNT OF FLOORS")
  console.log(building.floors)
  console.log(building)
  return building
}

  module.exports = {publishBuildings, getBuildings, saveBuilding,buildingExists, getBuildingByName, createNewBuilding, updateBuilding}