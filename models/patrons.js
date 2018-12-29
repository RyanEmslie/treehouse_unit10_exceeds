// Sqlite3 Patron table - sequelize v3 needed a primary key
// DATEONLY only works in v3 or greater

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First Name is required"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last Name is required"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Address is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Library ID is required"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Zip Code is required"
        }
      }
    }
  },  {
    classMethods: {
      associate: function(models) {
        Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'});
        
      }
    },
    timestamps: false
  });
  return Patrons;
};