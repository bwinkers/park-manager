'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Parks', [{
        name: 'Spaceport RV Park',
        billingCode: 'Park-J20',
        street: '2121 Nadeau St',
        city: 'Mojave',
        state: 'CA',
        zip: '93501',
        createdAt: new Date(),
        updatedAt: new Date()
     }], {});
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('Parks', null, {});
  }
};
