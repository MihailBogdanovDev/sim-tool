const { publishMessage } = require('./publish');
const topics = require('./topics');

// Function to generate topics for offices and eos
module.exports.generateTopics = async function generateTopics(building) {
  const topicsArray = [];

  // Loop through floors
  console.log("BUILDING FLOORS ARE")
  console.log(building.floors)
  building.floors.forEach((floor, floorIndex) => {
    console.log(`IN FLOOR FOREACH ${floorIndex}`)
    const floorStr = String(floorIndex).padStart(2, '0'); // Format floor number as two digits
    
    // Loop through rooms on each floor
    floor.forEach((room, roomIndex) => {
      console.log(`IN ROOM FOREACH ${roomIndex}`)
      const roomStr = String(roomIndex).padStart(2, '0'); // Format room number as two digits
      
      // Loop through Eos devices in each room
      room.eosDevices.forEach((eos, eosIndex) => {
        const eosStr = String(eosIndex).padStart(2, '0'); // Format Eos device number as two digits
        
        // Generate the topic for this combination of floor, room, and eos device
        const statusTopic = topics.generateBuildingTopic(building.name, floorStr, roomStr, eosStr);

        const deviceSubTopics = topics.generateEOSTopics(building.name, floorStr, roomStr, eosStr) //Use general device method instead for eos
        
        // Push both topics to the array to ensure both get published
        topicsArray.push(statusTopic);

        deviceSubTopics.forEach((subTopic, subTopicIndex) => {
            topicsArray.push(subTopic)
        })
       
      });
    });
  });
  console.log("TOPICS ARE")
  console.log(topicsArray)
  return topicsArray;
  };

// Function to generate topics for sateraitos

module.exports.generateSateraitoTopics = async function generateSateraitoTopics(building) {
  const topicsArray = [];
  console.log("IN SATERAITO TOPICS")
  // Loop through floors
  building.floors.forEach((floor, floorIndex) => { 
    console.log("IN FLOOR FOREACH")
    const floorStr = String(floorIndex).padStart(2, '0'); // Format floor number as two digits

    // Loop through Sateraitos on each floor
    building.sateraitos.forEach((sateraito, sateraitoIndex) => {
      console.log("IN SATERAITO FOREACH") 
      const sateraitoStr = String(sateraitoIndex).padStart(2, '0'); // Format Sateraito number as two digits

      // Generate the topic for this Sateraito
      const statusTopic = topics.generateSateraitoTopics(building.name, floorStr, sateraitoStr);

      //const deviceSubTopics = topics.generateSateraitoSubTopics(building.name, floorStr, sateraitoStr); // Use general device method instead for eos

      // Push both topics to the array to ensure both get published
      topicsArray.push(statusTopic);

      /*deviceSubTopics.forEach((subTopic, subTopicIndex) => {
        topicsArray.push(subTopic);
      });*/
    });
  });

  console.log("TOPICS ARE");
  console.log(topicsArray);
  return topicsArray;
};