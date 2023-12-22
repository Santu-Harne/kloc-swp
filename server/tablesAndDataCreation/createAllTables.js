const sectionTableCreation = require('./sectionTableCreation')
const userTableCreation = require('./userTableCreation')
const questionTableCreation = require('./questionTableCreation')
const clientResponseTableCreation = require('./clientResponseTableCreation')
const competitionAnalysisTableCreation = require('./competitionAnalysisTableCreation')
const coreCompetencyNameTableCreation = require('./coreCompetencyNameTableCreation')
const coreCompetenciesTableCreation = require('./coreCompetenciesTableCreation')

const createAllTables = async (connection) => {
  //1 Create section_table in the new database
  await sectionTableCreation(connection)

  //2 Create user_table in the new database
  await userTableCreation(connection)

  //3 Create question_table in the new database
  await questionTableCreation(connection)

  //4 Create clientResponse_table in the new database
  await clientResponseTableCreation(connection)

  //5 Create competitionAnalysis_table in the new database
  await competitionAnalysisTableCreation(connection)

  //6 Create coreCompetencyName_table in the new database
  await coreCompetencyNameTableCreation(connection)

  //7 Create coreCompetencies_table in the new database
  await coreCompetenciesTableCreation(connection)

}
module.exports = createAllTables