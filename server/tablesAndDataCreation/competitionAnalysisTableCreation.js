
const competitionAnalysisTableCreation = (connection) => {
  return new Promise((resolve, reject) => {
    const competitionAnalysisTableCreateQuery = `CREATE TABLE IF NOT EXISTS competitiveAnalysis_table (
      competitiveName TEXT,
      competitiveAnalysisId VARCHAR(50) PRIMARY KEY NOT NULL,
      companyProfile TEXT,
      keyCompetitiveAdvantage TEXT,
      targetMarket TEXT,
      marketingStrategy TEXT,
      productPricing TEXT,
      productsAndServices TEXT,
      strengths TEXT,
      weaknesses TEXT,
      opportunities TEXT,
      threats TEXT,
      klocInput TEXT,
      userId VARCHAR(50) NOT NULL,
      FOREIGN KEY ( userId) REFERENCES user_table ( userId)
      )`
    connection.query(competitionAnalysisTableCreateQuery, (err, result) => {
      if (err) {
        console.error('Error creating competitionAnalysis_table:', err);
        reject(err);
      }
      else {
        if (result.warningStatus === 0) {
          console.log('competitionAnalysis_table created');
        }
        resolve();
      }
    })
  })
}

module.exports = competitionAnalysisTableCreation