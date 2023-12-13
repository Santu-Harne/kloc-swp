const route = require('express').Router()
const questionControlelr =  require('../controller/qustionController')

route.get('/get_allquestions',questionControlelr.getAllQuestions)
route.post('/create_question',questionControlelr.createQuestions)
route.put('/updatequestion/:questionID', questionControlelr.updateQuestion);
route.delete('/deletequestion/:questionID',questionControlelr.deleteQuestion)
route.get('/getquestion/:questionID',questionControlelr.getQuestion)
module.exports = route