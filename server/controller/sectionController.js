const assert = require('assert');
const { StatusCodes } = require('http-status-codes');
const db = require('../db/database');
const idGenerator = require('../utils/idGenerator');

const sectionController = {
  getAllSections: async (req, res) => {
    const query = 'SELECT * FROM section_table';
    db.query(query, (err, response) => {
      if (err) assert.deepStrictEqual(err, null);
      res.status(StatusCodes.OK).json({ msg: 'All sections data', data: response });
    });
  },

  getSectionById: async (req, res) => {
    try {
      const sectionID = req.params.sectionId;
      // console.log('Received sectionID:', sectionID);
      const query = 'SELECT * FROM section_table WHERE sectionId = ?';
      db.query(query, [sectionID], (err, response) => {
        if (err) {
          //console.error('Database Error:', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
        } else {
          if (response && response.length > 0) {
            res.status(StatusCodes.OK).json({ msg: 'Section data', data: response });
          } else {
            res.status(StatusCodes.NOT_FOUND).json({ msg: 'Section not found' });
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
  },
  // createSection: async (req, res) => {
  //   const reqBody = req.body;
  //   // console.log('Request Body:', reqBody); // Add this line
  //   const newId = await idGenerator('section', 'section_table');
  //   // res.json(newId)
  //   const sectionData = { sectionId: newId, sectionName: reqBody.sectionName };
  //   const query = 'INSERT INTO section_table SET ?';

  //   db.query(query, sectionData, (err, response) => {
  //     if (err) assert.deepStrictEqual(err, null);
  //     res.status(StatusCodes.OK).json({ msg: 'Section created successfully', data: sectionData });
  //   });
  // },

  createSection: async (req, res) => {
    const reqBody = req.body;

    try {
      const insertedSections = [];
      for (const section of reqBody) {
        const newId = await idGenerator('section', 'section_table');
        const sectionData = { sectionId: newId, sectionName: section.sectionName };
        const query = 'INSERT INTO section_table SET ?';

        await new Promise((resolve, reject) => {
          db.query(query, sectionData, (err, response) => {
            if (err) {
              //console.error('Database Error:', err);
              reject(err);
            } else {
              insertedSections.push(sectionData);
              resolve(response);
            }
          });
        });
      }
      res.status(StatusCodes.OK).json({ msg: 'Sections created successfully', data: insertedSections });
    } catch (error) {
      console.error('Error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
    }
  },

  updateSection: async (req, res) => {
    const sectionID = req.params.sectionId;
    const reqBody = req.body;
    const query = 'UPDATE section_table SET ? WHERE sectionId = ?';

    db.query(query, [reqBody, sectionID], (err, response) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
      } else {
        if (response && response.affectedRows > 0) {
          res.status(StatusCodes.OK).json({ msg: 'Section updated successfully' });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({ msg: 'Section not found' });
        }
      }
    });
  },

  deleteSection: async (req, res) => {
    const sectionID = req.params.sectionId;
    const query = 'DELETE FROM section_table WHERE sectionId = ?';
    db.query(query, [sectionID], (err, response) => {
      if (err) {
        console.error('Database Error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
      } else {
        if (response && response.affectedRows > 0) {
          res.status(StatusCodes.OK).json({ msg: 'Section deleted successfully' });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({ msg: 'Section not found' });
        }
      }
    });
  },
};


module.exports = sectionController;
