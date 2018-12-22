'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'});
        Loans.belongsTo(models.Books, {foreignKey: 'book_id'});
      }
    },
    timestamps: false
  });
  return Loans;
};