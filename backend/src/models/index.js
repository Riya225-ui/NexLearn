const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Use Render PostgreSQL if DATABASE_URL is provided
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Fallback to local MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'nexlearn_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}


const User = require('./User')(sequelize);
const Document = require('./Document')(sequelize);
const ChatHistory = require('./ChatHistory')(sequelize);
const ContactMessage = require('./ContactMessage')(sequelize);


User.hasMany(Document, { foreignKey: 'userId', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(ChatHistory, { foreignKey: 'userId', as: 'chatHistories' });
ChatHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Document.hasMany(ChatHistory, { foreignKey: 'documentId', as: 'chatHistories' });
ChatHistory.belongsTo(Document, { foreignKey: 'documentId', as: 'document' });

module.exports = { sequelize, User, Document, ChatHistory, ContactMessage };
