const Reading = require('../models/readingModel');
const Sensor = require('../models/sensorModel');
const Counter = require('../models/counterModel');

class ReadingService {

    // Get next ID
    async getNextReadingId() {
        const counter = await Counter.findOneAndUpdate(
            { _id: "readings" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        return counter.seq;
    }

    // Validate data
    async validateReadingData(data, isUpdate = false) {
        const errors = [];


        if (!isUpdate || data.idSensor !== undefined) {
            if (data.idSensor === undefined) {
                errors.push("idSensor es requerido");
            } else if (typeof data.idSensor !== "number") {
                errors.push("idSensor debe ser numérico");
            } else {
                const sensor = await Sensor.findOne({ idSensor: data.idSensor });
                if (!sensor) errors.push("El sensor indicado no existe");
            }
        }


        if (!isUpdate || data.value !== undefined) {
            if (data.value === undefined || data.value === null) {
                errors.push("El valor de la lectura es requerido");
            } else if (typeof data.value !== "number") {
                errors.push("El valor debe ser numérico");
            }
        }


        if (data.time) {
            const date = new Date(data.time);
            if (isNaN(date.getTime())) {
                errors.push("La fecha (time) no es válida");
            }
        }

        return errors;
    }

    // Create reading
    async create(data) {
        const errors = await this.validateReadingData(data, false);
        if (errors.length > 0) {
            throw new Error("Datos de lectura inválidos: " + errors.join(", "));
        }

        // Auto-increment ID
        data.readingId = await this.getNextReadingId();

        const newReading = new Reading(data);
        return await newReading.save();
    }

    // Get all readings
    async findAll() {
        const readings = await Reading.find();

        const output = [];

        for (const r of readings) {
            const sensor = await Sensor.findOne({ idSensor: r.idSensor });

            output.push({
                ...r._doc,
                sensor: sensor
                    ? {
                        idSensor: sensor.idSensor,
                        type: sensor.type,
                        unit: sensor.unit,
                        location: sensor.location,
                        model: sensor.model
                    }
                    : null
            });
        }

        return output;
    }

    // Get reading by ID
    async findOne(readingId) {
        const reading = await Reading.findOne({ readingId: Number(readingId) });
        if (!reading) throw new Error("Lectura no encontrada");

        const sensor = await Sensor.findOne({ idSensor: reading.idSensor });

        return {
            ...reading._doc,
            sensor: sensor
                ? {
                    idSensor: sensor.idSensor,
                    type: sensor.type,
                    unit: sensor.unit,
                    location: sensor.location,
                    model: sensor.model
                }
                : null
        };
    }

    // Update reading
    async update(readingId, data) {
        const existing = await Reading.findOne({ readingId: Number(readingId) });
        if (!existing) throw new Error("Lectura no encontrada para actualizar");

        const errors = await this.validateReadingData(data, true);
        if (errors.length > 0)
            throw new Error("Datos de actualización inválidos: " + errors.join(", "));

        const updated = await Reading.findOneAndUpdate(
            { readingId: Number(readingId) },
            data,
            { new: true }
        );

        return updated;
    }

    // Delete reading
    async delete(readingId) {
        const deleted = await Reading.findOneAndDelete({ readingId: Number(readingId) });
        if (!deleted) throw new Error("Lectura no encontrada para eliminar");

        return deleted;
    }
}

module.exports = ReadingService;
