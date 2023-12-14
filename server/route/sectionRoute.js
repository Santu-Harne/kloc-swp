
const express = require('express');
const sectionController = require('../controller/sectionController');

const router = express.Router();

router.post('/create', sectionController.createSection);

router.get('/getAll', sectionController.getAllSections);

router.get('/get/:sectionId', sectionController.getSectionById)

router.put('/update/:sectionId', sectionController.updateSection);

router.delete('/delete/:sectionId', sectionController.deleteSection);

module.exports = router;

