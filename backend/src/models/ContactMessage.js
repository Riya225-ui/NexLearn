const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactMessage = sequelize.define('ContactMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'replied'),
      defaultValue: 'unread',
    },
  }, {
    tableName: 'contact_messages',
    timestamps: true,
  });

  return ContactMessage;
};
