// select corecompetencyName Data from core competency name table with corecompetency name condition
const selectAllFromCoreCompetencyName='SELECT * FROM coreCompetencyName_table WHERE coreCompetencyName = ?'
// insert data into core competency name table
const insertDataIntoCoreCompetencyName='INSERT INTO coreCompetencyName_table SET ?'
// select all data from core competency name table
const selectAllDataFromCoreCompetencyName=`SELECT * FROM coreCompetencyName_table`
// select core competency name id from core competency name table with core competency name id
const selectCoreCompetencyNameIdFromCoreCompetencyName=`SELECT coreCompetencyNameId FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`
// select one core competency name data from core competency name table
const selectOneDataFromCoreCompetencyName=`SELECT * FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`
// update core competency name data
const updateCoreCompetencyNameData=`UPDATE coreCompetencyName_table SET ? WHERE coreCompetencyNameId=?`
// delete core competency name data
const deleteCoreCompetencyNameData=`DELETE FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`
// select userId from user table
const selectUserIdFromUser=`SELECT userId FROM user_table WHERE userId=?`
// select all from core competencies table using coreCompetencyNameId and userId
const selectAllFromCoreCompetenciesTable=`SELECT * FROM corecompetencies_table WHERE coreCompetencyNameId=? AND userId=?`
// insert data into core competencies table
const insertDataIntoCoreCompetenciesTable=`
INSERT INTO coreCompetencies_table (coreCompetenciesId, userId, coreCompetencyNameId, description, importance, defensability, klocInput)
VALUES (?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    importance = VALUES(importance),
    defensability = VALUES(defensability),
    klocInput = VALUES(klocInput);
`
// select all from core competencies table using core competency name and user table joins
const selectAllCoreCompetenciesData= `
SELECT * 
FROM coreCompetencies_table
JOIN user_table ON user_table.userId=coreCompetencies_table.userId
JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
WHERE coreCompetencies_table.userId = ? 
ORDER BY coreCompetencies_table.coreCompetenciesId`
// select core competency name id from core competencies table
const selectCoreCompetencyNameIdFromCoreCompetenciesTable=`SELECT coreCompetencyNameId FROM coreCompetencies_table WHERE coreCompetencyNameId=?`
// select one core competency data from core competencies table
const selectOneCoreCompetenciesData=`
SELECT * 
FROM coreCompetencies_table
JOIN user_table ON user_table.userId=coreCompetencies_table.userId
JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
WHERE coreCompetencies_table.userId = ? 
AND coreCompetencies_table.coreCompetencyNameId = ?`
// update core competencies data
const updateCoreCompetenciesData=`UPDATE coreCompetencies_table SET ? WHERE userId=? AND coreCompetencyNameId=?`
// delete core competencies Data
const deleteCoreCompetenciesData=`DELETE FROM coreCompetencies_table WHERE userId=? AND coreCompetencyNameId=?`

module.exports={selectAllFromCoreCompetencyName,insertDataIntoCoreCompetencyName,selectAllDataFromCoreCompetencyName,selectCoreCompetencyNameIdFromCoreCompetencyName,
selectOneDataFromCoreCompetencyName,updateCoreCompetencyNameData,deleteCoreCompetencyNameData,selectUserIdFromUser,selectAllFromCoreCompetenciesTable,
insertDataIntoCoreCompetenciesTable,selectAllCoreCompetenciesData,selectOneCoreCompetenciesData,updateCoreCompetenciesData,deleteCoreCompetenciesData,
selectCoreCompetencyNameIdFromCoreCompetenciesTable}