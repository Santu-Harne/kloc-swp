const db = require('./../db/database')


// Function to generate a new sequence ID
const idGenerator = (field, tableName) => {

  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(${field + 'Id'}) AS prevId FROM ${tableName}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error(`Error fetching max ${field}Id:`, err);
        reject(err);
        return;
      } else {
        let prevId = results[0].prevId || `${field}_0000`;
        const currentNumber = parseInt(prevId.split('_')[1]);
        const nextNumber = currentNumber + 1;
        const nextClientId = `${field}_${nextNumber.toString().padStart(4, '0')}`;
        console.log(nextClientId)
        resolve(nextClientId);
      }
    });
  });
}

module.exports = idGenerator