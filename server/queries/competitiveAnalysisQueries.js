// create competitive anslysis sql query
const competitiveAnalysisQueries={
  //  select userId from user table
  selectUserIdQuery:`SELECT userId FROM user_table WHERE userId=?`,
  // select all competitive analysis data from competitive analysis table 
  selectCompetitiveAnalysisQuery:`SELECT * FROM competitiveAnalysis_table WHERE competitiveName=? AND userId=?`,
  // Insert query for competitive analysis table
  insertCompetitiveAnalysisQuery:`INSERT INTO competitiveAnalysis_table 
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
    threats = VALUES(threats)`,
  // select userId from competitive analysis table
  selectUserIdFromCompetitiveAnalysis:`SELECT userId FROM competitiveAnalysis_table WHERE userId=?`,
  // select all competitive analysis data from competitive analysis and user tables using joins
  selectAllFromCompetitiveAnalysisAndUserTables:`SELECT * 
  FROM competitiveAnalysis_table
  JOIN user_table ON user_table.userId=competitiveAnalysis_table.userId
  WHERE competitiveAnalysis_table.userId = ? 
  ORDER BY competitiveAnalysis_table.competitiveAnalysisId`,
  // select competitive analysis id from competitive analysis table
  selectCompetitiveAnalysisId:`SELECT competitiveAnalysisId FROM competitiveAnalysis_table WHERE userId=? AND competitiveAnalysisId=?`,
  // select competitive Analysis Data using competitive analysis and user tables using joins
  selectCompetitiveAnalysisFromCompetitiveAnalysisAndUserTables:`
  SELECT * 
  FROM competitiveAnalysis_table
  JOIN user_table ON user_table.userId=competitiveAnalysis_table.userId
  WHERE competitiveAnalysis_table.userId = ? 
  AND competitiveAnalysis_table.competitiveAnalysisId = ?`,
  // updateCompetitiveAnalysis
  updateCompetitiveAnalysis:'UPDATE competitiveAnalysis_table SET ? WHERE userId=? AND competitiveAnalysisId=?',
  // delete competitive analysis
  deleteCompetitiveAnalysis:'DELETE FROM competitiveAnalysis_table WHERE userId=? AND competitiveAnalysisId=?'
}

module.exports=competitiveAnalysisQueries