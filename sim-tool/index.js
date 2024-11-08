const MQTT = require("async-mqtt");
const { updateBuildingsInfo } = require("./mqtt/emitters/buildingsEmitter")
const { publishBuildings } = require("./mqtt/services/buildingsService")
const buildingController = require("./mqtt/controllers/buildingController")
const simulationController = require("./mqtt/controllers/simulationController")
const deviceService = require("./mqtt/services/deviceService")


const client = MQTT.connect({
  protocol: "mqtt",
  username: "adil",
  password: "adiL1997",
  clientId: "sim-tool",
  host: "10.102.12.3",
  port: 8883
});

const client2 = MQTT.connect("mqtt://10.100.10.60:1883")

client2.on("connect", async () => {
  console.log("Connected to MQTT broker");

  // Publish the buildings from buildings.json
  publishBuildings(client2);

  // Initialize controllers
  await buildingController.init(client2)
  await simulationController.init(client2)

  updateBuildingsInfo(client2)
});
