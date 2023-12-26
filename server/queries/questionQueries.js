// questionQueries.js
const questionQueries = {
   getAllQuestions: `SELECT * FROM question_table
                     JOIN section_table ON section_table.sectionId=question_table.sectionId
                     WHERE question_table.sectionId=?
                     ORDER BY question_table.questionId`,
   
   getSectionById: `SELECT sectionId FROM section_table WHERE sectionId=?`,
 
   getQuestionById: `SELECT * FROM question_table
                     JOIN section_table ON section_table.sectionId=question_table.sectionId
                     WHERE question_table.questionId = ? AND question_table.sectionId=?`,
 
   insertQuestion: 'INSERT INTO question_table SET ?',
 
   checkQuestionText: 'SELECT questionText FROM question_table WHERE questionText = ?',
 
   updateQuestion: 'UPDATE question_table SET ? WHERE questionId = ? AND sectionId=?',
 
   checkExistingQuestion: 'SELECT * FROM question_table WHERE questionID = ? AND sectionid=?',
 
   checkDuplicateQuestionText: 'SELECT * FROM question_table WHERE questionText = ? AND questionID != ?',
 
   deleteQuestion: 'DELETE FROM question_table WHERE questionId = ? AND sectionId=?',
 };
 
 module.exports = questionQueries;
 