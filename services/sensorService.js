const Sensor = require('../models/sensorModel');
const Device = require('../models/deviceModel');
const Counter = require('../models/counterModel');
const Reading = require('../models/readingModel');

class SensorService {

    // Get next ID
    async getNextSensorId() {
        const counter = await Counter.findOneAndUpdate(
            { _id: 'sensors' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        return counter.seq;
    }

    // Validate data
    async validateSensorData(data, isUpdate = false) {
        const errors = [];

        const validTypes = ['temperature', 'humidity', 'co2', 'noise'];
        const validUnits = ['°C', '%', 'ppm'];


        if (!isUpdate || data.type) {
            if (!data.type) errors.push('El tipo de sensor es requerido');
            else if (!validTypes.includes(data.type))
                errors.push(`El tipo debe ser uno de: ${validTypes.join(', ')}`);
        }


        if (!isUpdate || data.unit) {
            if (!data.unit) errors.push('La unidad de medida es requerida');
            else if (!validUnits.includes(data.unit))
                errors.push(`La unidad debe ser una de: ${validUnits.join(', ')}`);
        }


        if (data.type && data.unit) {
            if (data.type === 'temperature' && data.unit !== '°C')
                errors.push('Para temperatura la unidad debe ser °C');
            if (data.type === 'humidity' && data.unit !== '%')
                errors.push('Para humedad la unidad debe ser %');
        }


        if (!isUpdate || data.model) {
            if (!data.model) errors.push('El modelo del sensor es requerido');
            else if (typeof data.model !== 'string')
                errors.push('El modelo debe ser texto');
        }


        if (!isUpdate || data.deviceId !== undefined) {
            if (data.deviceId === undefined)
                errors.push('El ID del dispositivo es requerido');
            else if (typeof data.deviceId !== 'number')
                errors.push('deviceId debe ser numérico');
            else {
                const device = await Device.findOne({ id_device: data.deviceId });
                if (!device) errors.push('El dispositivo indicado no existe');
            }
        }


        if (!isUpdate || data.location) {
            if (!data.location) errors.push('La ubicación (location) es requerida');
            else if (typeof data.location !== 'string')
                errors.push('La ubicación debe ser texto');
        }


        if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
            errors.push('isActive debe ser true/false');
        }

        return errors;
    }

    // Create sensor
    async create(data) {
        const errors = await this.validateSensorData(data, false);
        if (errors.length > 0)
            throw new Error('Datos de sensor inválidos: ' + errors.join(', '));

        // Auto-increment ID
        data.idSensor = await this.getNextSensorId();

        // Create sensor
        const newSensor = new Sensor(data);
        const savedSensor = await newSensor.save();

        // Register in Device
        await Device.findOneAndUpdate(
            { id_device: data.deviceId },
            { $addToSet: { sensors: savedSensor._id } }
        );

        return savedSensor;
    }

    // Get all sensors
    async findAll() {
        return await Sensor.find();
    }

    // Get sensor by ID
    async findOne(idSensor) {
        const sensor = await Sensor.findOne({ idSensor: Number(idSensor) });
        if (!sensor) throw new Error('Sensor no encontrado');
        return sensor;
    }

    // Update sensor
    async update(idSensor, data) {
        const sensorExists = await Sensor.findOne({ idSensor: Number(idSensor) });
        if (!sensorExists) throw new Error('Sensor no encontrado para actualizar');

        const errors = await this.validateSensorData(data, true);
        if (errors.length > 0)
            throw new Error('Datos inválidos: ' + errors.join(', '));

        const updatedSensor = await Sensor.findOneAndUpdate(
            { idSensor: Number(idSensor) },
            data,
            { new: true }
        );

        // Update device association
        if (data.deviceId && data.deviceId !== sensorExists.deviceId) {
            await Device.findOneAndUpdate(
                { id_device: sensorExists.deviceId },
                { $pull: { sensors: sensorExists._id } }
            );
            await Device.findOneAndUpdate(
                { id_device: data.deviceId },
                { $addToSet: { sensors: updatedSensor._id } }
            );
        }

        return updatedSensor;
    }

    // Delete sensor
    async delete(idSensor) {
        const numericId = Number(idSensor);

        // Check associated readings
        const readingExists = await Reading.findOne({ idSensor: numericId });
        if (readingExists) {
            throw new Error('No se puede eliminar el sensor porque tiene lecturas asociadas');
        }

        // Find sensor
        const sensor = await Sensor.findOne({ idSensor: numericId });
        if (!sensor) throw new Error('Sensor no encontrado para eliminar');

        // Remove from Device
        await Device.findOneAndUpdate(
            { id_device: sensor.deviceId },
            { $pull: { sensors: sensor._id } }
        );

        // Delete sensor
        await Sensor.deleteOne({ idSensor: numericId });

        return sensor;
    }

}

module.exports = SensorService;
