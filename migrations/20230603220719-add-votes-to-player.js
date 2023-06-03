'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Players', 'upvotes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
    await queryInterface.addColumn('Players', 'downvotes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Players', 'upvotes');
    await queryInterface.removeColumn('Players', 'downvotes');
  }
}
