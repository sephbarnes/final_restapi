const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

router.route('/')
    .get(employeesController.getAllEmployees);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;