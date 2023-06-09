'use strict'
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
      Vote.belongsTo(models.Profile, { foreignKey: 'profileId' })
      Vote.belongsTo(models.Player, { foreignKey: 'playerId' })
    }
  }
  Vote.init({
    profileId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    vote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};