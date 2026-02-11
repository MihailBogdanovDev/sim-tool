require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const MQTT = require("async-mqtt");
const { updateBuildingsInfo } = require("./mqtt/emitters/buildingsEmitter")
const { publishBuildings } = require("./mqtt/services/buildingsService")
const buildingController = require("./mqtt/controllers/buildingController")
const simulationController = require("./mqtt/controllers/simulationController")
const deviceService = require("./mqtt/services/deviceService")


// Broker for demo: use MQTT_BROKER_URL env (e.g. mqtt://localhost:1883) or default
const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://10.100.10.60:1883";

const client = MQTT.connect({
  protocol: "mqtt",
  username: "adil",
  password: "adiL1997",
  clientId: "sim-tool",
  host: "10.102.12.3",
  port: 8883
});

const client2 = MQTT.connect(brokerUrl)

client2.on("error", (err) => {
  console.error("MQTT connection error:", err.message);
});

client2.on("connect", async () => {
  console.log("Connected to MQTT broker:", brokerUrl);

  // Publish the buildings from buildings.json
  publishBuildings(client2);

  // Initialize controllers
  await buildingController.init(client2)
  await simulationController.init(client2)

  updateBuildingsInfo(client2)
});
