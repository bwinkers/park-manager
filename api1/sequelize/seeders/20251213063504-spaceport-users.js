'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
        firstName: 'Brian',
        lastName: 'Winkers',
        email: 'spaceport2121@gmail.com',
        username: 'brian',
        phone: '760-338-1763',
        parkId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
     },{
        firstName: 'Kyura',
        lastName: 'Mallet',
        email: 'spaceport2121rv@gmail.com',
        username: 'kyura',
        phone: '702-444-9998',
        parkId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
     }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
