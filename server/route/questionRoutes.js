const route = require('express').Router()
const questionController =  require('../controller/questionController')

route.get('/question/getAll/:sectionId',questionController.getAllQuestions)
route.post('/question/create/:sectionId',questionController.createQuestions)
route.put('/question/update/:sectionId/:questionId', questionController.updateQuestion);
route.delete('/question/delete/:sectionId/:questionId',questionController.deleteQuestion)
route.get('/question/get/:sectionId/:questionId',questionController.getQuestion)
module.exports = route