const User = require('../models/userModel');
const UserService = require('./userService');
const Zone = require('../models/zoneModel');
const ZoneService = require('./zoneService');
const Sensor = require('../models/sensorModel');
const SensorService = require('./sensorService');
const Device = require('../models/deviceModel');
const DeviceService = require('./deviceService');

const userServices = new UserService(User);
const zoneServices = new ZoneService(Zone);
const sensorServices = new SensorService(Sensor);
const deviceServices = new DeviceService(Device);
module.exports = {
    userServices,
    zoneServices,
    sensorServices,
    deviceServices
};