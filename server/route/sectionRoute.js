// sectionRoute.js
const express = require('express');
const sectionController = require('../controller/sectionController');

const router = express.Router();

// Create a new section
router.post('/create', sectionController.createSection);

// Read all sections
router.get('/getAllSections', sectionController.getAllSections);

router.get('/getAllSectionsBySectionId/:sectionID', sectionController.getSectionById)

// Update a section by ID
router.put('/update/:sectionID', sectionController.updateSection);

// Delete a section by ID
router.delete('/delete/:sectionID', sectionController.deleteSection);

module.exports = router;
