const express = require('express');
const userRouter = require('./userRoutes');
const zoneRouter = require('./zoneRoutes');
const deviceRouter = require('./deviceRoutes');
const sensorRouter = require('./sensorRoutes');
const readingRouter = require('./readingRoutes');


function routerApi(app) {
  const router = express.Router();
  app.use('/api', router);
  router.use('/users', userRouter);
  router.use('/zones', zoneRouter);
  router.use('/devices', deviceRouter);
  router.use('/sensors', sensorRouter);
  router.use('/readings', readingRouter);
}

module.exports = routerApi;
