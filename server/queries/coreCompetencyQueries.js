const coreCompetenciesQueries={
    // select corecompetencyName Data from core competency name table with corecompetency name condition
    selectAllFromCoreCompetencyName:'SELECT * FROM coreCompetencyName_table WHERE coreCompetencyName = ?',
    // insert data into core competency name table
    insertDataIntoCoreCompetencyName:'INSERT INTO coreCompetencyName_table SET ?',
    // select all data from core competency name table
    selectAllDataFromCoreCompetencyName:`SELECT * FROM coreCompetencyName_table`,
    // select core competency name id from core competency name table with core competency name id
    selectCoreCompetencyNameIdFromCoreCompetencyName:`SELECT coreCompetencyNameId FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,
    // select one core competency name data from core competency name table
    selectOneDataFromCoreCompetencyName:`SELECT * FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,
    // update core competency name data
    updateCoreCompetencyNameData:`UPDATE coreCompetencyName_table SET ? WHERE coreCompetencyNameId=?`,
    // delete core competency name data
    deleteCoreCompetencyNameData:`DELETE FROM coreCompetencyName_table WHERE coreCompetencyNameId=?`,
    // select userId from user table
    selectUserIdFromUser:`SELECT userId FROM user_table WHERE userId=?`,
    // select all from core competencies table using coreCompetencyNameId and userId
    selectAllFromCoreCompetenciesTable:`SELECT * FROM corecompetencies_table WHERE coreCompetencyNameId=? AND userId=?`,
    // insert data into core competencies table
    insertDataIntoCoreCompetenciesTable:`
    INSERT INTO coreCompetencies_table (coreCompetenciesId, userId, coreCompetencyNameId, description, importance, defensability, klocInput)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        description = VALUES(description),
        importance = VALUES(importance),
        defensability = VALUES(defensability),
        klocInput = VALUES(klocInput);
    `,
    // select all from core competencies table using core competency name and user table joins
    selectAllCoreCompetenciesData:`
    SELECT * 
    FROM coreCompetencies_table
    JOIN user_table ON user_table.userId=coreCompetencies_table.userId
    JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
    WHERE coreCompetencies_table.userId = ? 
    ORDER BY coreCompetencies_table.coreCompetenciesId`,
    // select core competency name id from core competencies table
    selectCoreCompetencyNameIdFromCoreCompetenciesTable:`SELECT coreCompetencyNameId FROM coreCompetencies_table WHERE coreCompetencyNameId=?`,
    // select one core competency data from core competencies table
    selectOneCoreCompetenciesData:`
    SELECT * 
    FROM coreCompetencies_table
    JOIN user_table ON user_table.userId=coreCompetencies_table.userId
    JOIN coreCompetencyName_table ON coreCompetencyName_table.coreCompetencyNameId=coreCompetencies_table.coreCompetencyNameId
    WHERE coreCompetencies_table.userId = ? 
    AND coreCompetencies_table.coreCompetencyNameId = ?`,
    // update core competencies data
    updateCoreCompetenciesData:`UPDATE coreCompetencies_table SET ? WHERE userId=? AND coreCompetencyNameId=?`,
    // delete core competencies Data
    deleteCoreCompetenciesData:`DELETE FROM coreCompetencies_table WHERE userId=? AND coreCompetencyNameId=?`
}


module.exports=coreCompetenciesQueries