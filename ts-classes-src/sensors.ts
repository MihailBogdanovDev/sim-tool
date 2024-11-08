export enum SensorState{
    ONLINE = "ON",
    OFFLINE = "OFF",
    NAN = "nan"
}

//Base interface for sensors
export interface Sensor<T>{
    name: string;
    state: T;
    status: SensorState;
}

// Specific sensor types with their respective states
export interface TemperatureSensor extends Sensor<number> {}
export interface HumiditySensor extends Sensor<number> {}
export interface LightSensor extends Sensor<number> {}
export interface UptimeSensor extends Sensor<number> {}
export interface MacAddressSensor extends Sensor<string> {}
export interface WifiSignalSensor extends Sensor<number> {}
export interface BssidSensor extends Sensor<string> {}
export interface IpAddressSensor extends Sensor<string> {}
export interface ConnectedSsidSensor extends Sensor<string> {}

// Binary sensor for movement detection
export interface BinarySensor extends Sensor<"ON" | "OFF"> {}

// Switch for the restart functionality
export interface Switch extends Sensor<"ON" | "OFF"> {}

