const route = require('express').Router()
const questionController = require('../controller/questionController')

route.get('/get_allquestions', questionController.getAllQuestions)
route.post('/create_question', questionController.createQuestions)
route.put('/updatequestion/:questionID', questionController.updateQuestion);
route.delete('/deletequestion/:questionID', questionController.deleteQuestion)
route.get('/getquestion/:questionID', questionController.getQuestion)

module.exports = route
