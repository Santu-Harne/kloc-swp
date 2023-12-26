const bcrypt = require("bcryptjs")
const registerTemplate = require('../templates/registerTemplate')
const adminData = require('../utils/adminData')
const sendMail = require('../middleware/mail')

const createAdminData = async (connection) => {
  // connection.query(`SELECT * FROM user_table WHERE userId = user_0001`, async (err, response) => {
  //   if (err) {
  //     throw err;
  //   }
  //   else if (response.length === 0) {

  const hashedAdminData = await Promise.all(adminData.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.userPassword, 10);
    return { ...user, userPassword: hashedPassword };
  }));

  const values = hashedAdminData.map(user => Object.values(user));
  const columns = Object.keys(hashedAdminData[0]);

  const placeholders = values.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');

  const query = `INSERT IGNORE INTO user_table (${columns.join(', ')}) VALUES ${placeholders}`;

  connection.query(query, values.flat(), (err, response) => {
    if (err) {
      // Handle error during database creation
      console.error('Error creating adminData:', err);
    } else {
      const subject = 'Confirmation of registration with KLOC-SWP';
      adminData.forEach(user => {
        const template = registerTemplate(user.userName, user.userEmail, user.userPassword,);
        // sendMail(user.userEmail, subject, template)
      })
      console.log('admin data created successfully!');
    }
  });

  //   }
  // })
}
module.exports = createAdminData