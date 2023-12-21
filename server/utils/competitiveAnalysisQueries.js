// create competitive anslysis sql query
//  select userId from user table
const selectUserIdQuery=`SELECT userId FROM user_table WHERE userId=?`
// select all competitive analysis data from competitive analysis table 
const selectCompetitiveAnalysisQuery=`SELECT * FROM competitiveAnalysis_table WHERE competitiveName=? AND userId=?`
// Insert query for competitive analysis table
const insertCompetitiveAnalysisQuery=`INSERT INTO competitiveAnalysis_table 
(competitiveAnalysisId, userId, competitiveName, companyProfile, keyCompetitiveAdvantage, targetMarket, marketingStrategy, productPricing, productsAndServices, strengths, weaknesses, opportunities, threats)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  companyProfile = VALUES(companyProfile),
  keyCompetitiveAdvantage = VALUES(keyCompetitiveAdvantage),
  targetMarket = VALUES(targetMarket),
  marketingStrategy = VALUES(marketingStrategy),
  productPricing = VALUES(productPricing),
  productsAndServices = VALUES(productsAndServices),
  strengths = VALUES(strengths),
  weaknesses = VALUES(weaknesses),
  opportunities = VALUES(opportunities),
  threats = VALUES(threats)`;
// select userId from competitive analysis table
const selectUserIdFromCompetitiveAnalysis=`SELECT userId FROM competitiveAnalysis_table WHERE userId=?`
// select all competitive analysis data from competitive analysis and user tables using joins
const selectAllFromCompetitiveAnalysisAndUserTables=`SELECT * 
FROM competitiveAnalysis_table
JOIN user_table ON user_table.userId=competitiveAnalysis_table.userId
WHERE competitiveAnalysis_table.userId = ? 
ORDER BY competitiveAnalysis_table.competitiveAnalysisId`
// select competitive analysis id from competitive analysis table
const selectCompetitiveAnalysisId=`SELECT competitiveAnalysisId FROM competitiveAnalysis_table WHERE userId=? AND competitiveAnalysisId=?`
// select competitive Analysis Data using competitive analysis and user tables using joins
const selectCompetitiveAnalysisFromCompetitiveAnalysisAndUserTables=`
SELECT * 
FROM competitiveAnalysis_table
JOIN user_table ON user_table.userId=competitiveAnalysis_table.userId
WHERE competitiveAnalysis_table.userId = ? 
AND competitiveAnalysis_table.competitiveAnalysisId = ?`
// updateCompetitiveAnalysis
const updateCompetitiveAnalysis='UPDATE competitiveAnalysis_table SET ? WHERE userId=? AND competitiveAnalysisId=?'
// delete competitive analysis
const deleteCompetitiveAnalysis='DELETE FROM competitiveAnalysis_table WHERE userId=? AND competitiveAnalysisId=?'

module.exports={selectUserIdQuery,selectCompetitiveAnalysisQuery,insertCompetitiveAnalysisQuery,selectUserIdFromCompetitiveAnalysis,selectAllFromCompetitiveAnalysisAndUserTables,selectCompetitiveAnalysisId,selectCompetitiveAnalysisFromCompetitiveAnalysisAndUserTables,updateCompetitiveAnalysis,deleteCompetitiveAnalysis}