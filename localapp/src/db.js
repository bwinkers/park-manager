import Dexie from 'dexie';
// import spacesData from './appdata/spaces.json';

export const db = new Dexie('ParkManager');
db.version(22).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, type, length, electric, metered, hasWater, hasSewer, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
});
// Version 23 adds a migration to ensure existing tenant records receive an `active` flag defaulting to true.
db.version(23).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, type, length, electric, metered, hasWater, hasSewer, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('tenants').toCollection().modify(t => {
    if (t.active === undefined) t.active = true;
  });
});
// Version 24 adds tenantId field to spaces and initializes missing tenantId to null
db.version(24).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.tenantId === undefined) s.tenantId = null;
  });
});
// Version 25 adds weeklyRental boolean to spaces and defaults to false for existing rows
db.version(25).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRental, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.weeklyRental === undefined) s.weeklyRental = false;
  });
});
// Version 26 replaces weeklyRental with weeklyRate (whole dollars), defaulting to null
db.version(26).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.weeklyRate === undefined) s.weeklyRate = null;
    if (Object.prototype.hasOwnProperty.call(s, 'weeklyRental')) delete s.weeklyRental;
  });
});
// Version 27 adds storageRate (whole dollars), defaulting to null
db.version(27).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.storageRate === undefined) s.storageRate = null;
  });
});
// Version 28 adds monthlyRate (whole dollars), defaulting to null
db.version(28).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, monthlyRate, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.monthlyRate === undefined) s.monthlyRate = null;
  });
});
// Version 29 adds an images table for storing photos separately and referencing via imgIds
db.version(29).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, monthlyRate, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
  images: '++id, spaceId, createdAt'
});
// Version 30 adds photoId field to spaces to reference latest image
db.version(30).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, monthlyRate, photoId, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
  images: '++id, createdAt'
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.photoId === undefined) s.photoId = null;
  });
});
// Version 31 adds deposit (whole dollars) to spaces, defaulting to null
db.version(31).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, monthlyRate, deposit, photoId, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
  images: '++id, createdAt'
}).upgrade(tx => {
  return tx.table('spaces').toCollection().modify(s => {
    if (s.deposit === undefined) s.deposit = null;
  });
});
// Version 32 adds a dedicated table for meter reading images
db.version(32).stores({
  tenants: '++id, firstName, lastName, phone, autocharge, email, active, notes',
  spaces: 'id, tenantId, type, length, electric, metered, hasWater, hasSewer, weeklyRate, storageRate, monthlyRate, deposit, photoId, notes',
  leases: '++id, tenantId, spaceId, startDate, endDate, rentalType, rate, isDelinquent, notes',
  parkBillings: '++id, month, year, spaceId, utility, rent, storage, lateCharge, miscFees, deposit, climateCredit, amount, notes',
  rentPayments: '++id, spaceId, paymentDate, amount, paymentType, notes, billedElectric, billedRent, trash, storage, miscFees, lateCharge, moveInDeposit, climateCredit',
  overnightPayments: '++id, ticketNumber, firstName, lastName, licensePlate, streetAddress, streetAddress2, city, state, zip, numInParty, reason, rvType, checkInDate, checkOutDate, paymentDate, amountCollected, paymentType, notes',
  otherPayments: '++id, spaceId, name, paymentDate, amount, qty, paymentType, reason, notes',
  meterReadings: '++id, spaceId, readingDate, readingValue, adjustedReading, notes',
  deposits: '++id, cash, itemsTotal, total, date, notes',
  pettyCash: '++id, amount, disbursedDate, paidTo, submittedBy, paidFor, receiptDate, disbursedBy, isCredit, notes',
  waitList: '$$id, name, phone, email, rvType, rvLength, rvYear, backgroundCheck, desiredStartDate, dateAdded, notes, status',
  reservations: '$$id, name, phone, email, rvType, numInParty, checkInDate, checkOutDate, notes',
  maintenanceRequests: '++id, spaceId, parkArea, requestDate, description, status, completedDate, pettyCashTransactions, imgIds, notes',
  images: '++id, createdAt',
  meterReadingImages: '++id, readingId, spaceId, createdAt'
})
// no upgrade needed; new table only
db.open().catch((err) => {
  console.error('Failed to open db: ' + (err.stack || err));
});

// // Seed the `space` table from `src/appdata/spaces.json` if it's empty.
// (async () => {
//   try {
//     // wait for DB to be ready
//     await db.open();

//     const count = await db.spaces.count();
//     if (!count) {
//       const entries = Object.entries(spacesData).map(([id, info]) => ({ id, ...info }));
//       // use bulkPut so existing keys are updated if present
//       await db.spaces.bulkPut(entries);
//       console.info(`Seeded ${entries.length} spaces into the Dexie 'spaces' table`);
//     }
//   } catch (err) {
//     console.error('Error seeding spaces into Dexie: ', err);
//   }
// })();

