// Sqlite3 Loans table - sequelize v3 needed a primary key
// DATEONLY only works in v3 or greater
'use strict';
module.exports = function(sequelize, DataTypes) {
  var loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a loaned-on date"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a return-by date"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a returned-on date"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'});
        loans.belongsTo(models.Books, {foreignKey: 'book_id'});
      }
    },
    timestamps: false
  });
  return loans;
};