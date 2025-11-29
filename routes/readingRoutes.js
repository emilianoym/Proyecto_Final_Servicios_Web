const express = require('express');
const router = express.Router();
const ReadingService = require('../services/readingService');
const service = new ReadingService();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reading:
 *       type: object
 *       properties:
 *         readingId:
 *           type: number
 *           description: ID numérico autoincremental de la lectura
 *           example: 1
 *         idSensor:
 *           type: number
 *           description: ID numérico del sensor asociado
 *           example: 3
 *         time:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la lectura
 *           example: "2025-01-20T15:30:00Z"
 *         value:
 *           type: number
 *           description: Valor de la lectura
 *           example: 26.4
 *
 *     ReadingInput:
 *       type: object
 *       required:
 *         - idSensor
 *         - value
 *       properties:
 *         idSensor:
 *           type: number
 *           description: ID numérico del sensor
 *           example: 3
 *         value:
 *           type: number
 *           description: Valor de la lectura
 *           example: 28.9
 *         time:
 *           type: string
 *           format: date-time
 *           description: Fecha opcional de la lectura
 *           example: "2025-01-20T14:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Readings
 *   description: Gestión de lecturas de sensores
 */

/**
 * @swagger
 * /api/readings:
 *   get:
 *     summary: Obtener todas las lecturas
 *     tags: [Readings]
 *     responses:
 *       200:
 *         description: Lista de lecturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reading'
 */
router.get('/', async (req, res, next) => {
    try {
        const readings = await service.findAll();
        res.json(readings);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/readings/{id}:
 *   get:
 *     summary: Obtener una lectura por su readingId
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: readingId de la lectura
 *     responses:
 *       200:
 *         description: Lectura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       404:
 *         description: Lectura no encontrada
 */
router.get('/:id', async (req, res, next) => {
    try {
        const reading = await service.findOne(req.params.id);
        res.json(reading);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/readings:
 *   post:
 *     summary: Registrar una nueva lectura
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReadingInput'
 *     responses:
 *       201:
 *         description: Lectura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res, next) => {
    try {
        const newReading = await service.create(req.body);
        res.status(201).json(newReading);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/readings/{id}:
 *   patch:
 *     summary: Actualizar una lectura existente
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: readingId de la lectura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReadingInput'
 *     responses:
 *       200:
 *         description: Lectura actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Lectura no encontrada
 */
router.patch('/:id', async (req, res, next) => {
    try {
        const updatedReading = await service.update(req.params.id, req.body);
        res.json(updatedReading);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/readings/{id}:
 *   delete:
 *     summary: Eliminar una lectura
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: readingId de la lectura
 *     responses:
 *       200:
 *         description: Lectura eliminada correctamente
 *       404:
 *         description: Lectura no encontrada
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedReading = await service.delete(req.params.id);
        res.json(deletedReading);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
