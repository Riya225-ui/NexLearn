const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extractedText: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    keyPoints: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: 'documents',
    timestamps: true,
  });

  return Document;
};
