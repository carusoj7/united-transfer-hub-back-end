'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Player.belongsTo(models.Profile, { foreignKey: 'profileId'})
      Player.hasMany(models.Vote)
    }
  }
  Player.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    position: DataTypes.STRING,
    team: DataTypes.STRING,
    transferFee: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    profileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};