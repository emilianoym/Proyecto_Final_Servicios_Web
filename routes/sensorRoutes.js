const express = require('express');
const router = express.Router();

const { sensorServices } = require('../services/indexService');

/**
 * @swagger
 * tags:
 *   - name: Sensors
 *     description: Gestión de sensores y su configuración
 */

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Obtener todos los sensores
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Lista de sensores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Sensor"
 */
router.get('/', async (req, res, next) => {
    try {
        const sensors = await sensorServices.findAll();
        res.json(sensors);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   get:
 *     summary: Obtener un sensor por su idSensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID del sensor
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Sensor"
 *       404:
 *         description: Sensor no encontrado
 */
router.get('/:id', async (req, res, next) => {
    try {
        const sensor = await sensorServices.findOne(req.params.id);
        res.json(sensor);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Crear un nuevo sensor
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SensorInput"
 *     responses:
 *       201:
 *         description: Sensor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Sensor"
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const sensor = await sensorServices.create(req.body);
        res.status(201).json(sensor);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   patch:
 *     summary: Actualizar un sensor existente
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *         description: ID del sensor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SensorInput"
 *     responses:
 *       200:
 *         description: Sensor actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Sensor"
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Sensor no encontrado
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const sensor = await sensorServices.update(req.params.id, req.body);
        res.json(sensor);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Eliminar un sensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID del sensor a eliminar
 *     responses:
 *       200:
 *         description: Sensor eliminado correctamente
 *       404:
 *         description: Sensor no encontrado
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const sensor = await sensorServices.delete(req.params.id);
        res.json({ message: 'Sensor eliminado correctamente', sensor });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Sensor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID Mongo ObjectId
 *           example: "673eaca98fb23f6cd2134a1b"
 *         idSensor:
 *           type: number
 *           description: ID autoincremental del sensor
 *           example: 3
 *         type:
 *           type: string
 *           enum: [temperature, humidity, co2, noise]
 *           example: temperature
 *         unit:
 *           type: string
 *           enum: ['°C', '%', 'ppm']
 *           example: "°C"
 *         model:
 *           type: string
 *           example: "DHT22"
 *         deviceId:
 *           type: number
 *           example: 4
 *         location:
 *           type: string
 *           example: "21.1522,-101.7105"
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     SensorInput:
 *       type: object
 *       required:
 *         - type
 *         - unit
 *         - model
 *         - deviceId
 *         - location
 *       properties:
 *         type:
 *           type: string
 *           enum: [temperature, humidity, co2, noise]
 *           example: humidity
 *         unit:
 *           type: string
 *           enum: ['°C', '%', 'ppm']
 *           example: "%"
 *         model:
 *           type: string
 *           example: "MQ-135"
 *         deviceId:
 *           type: number
 *           example: 2
 *         location:
 *           type: string
 *           example: "21.1522,-101.7105"
 *         isActive:
 *           type: boolean
 *           default: true
 */

module.exports = router;
