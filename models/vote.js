'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vote.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};