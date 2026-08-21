const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatHistory = sequelize.define('ChatHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'chat_histories',
    timestamps: true,
  });

  return ChatHistory;
};
