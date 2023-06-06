'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Players', 'upvotes')
    await queryInterface.removeColumn('Players', 'downvotes')
    await queryInterface.addColumn('Players', 'vote', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Players', 'upvotes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Players', 'downvotes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.removeColumn('Players', 'vote')
  }
};