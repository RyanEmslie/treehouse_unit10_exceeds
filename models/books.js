// Sqlite3 Books table - sequelize v3 needed a primary key
// DATEONLY only works in v3 or greater
  'use strict';
  
  module.exports = function(sequelize, DataTypes) {
    var books = sequelize.define('Books', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: "Please enter a valid title."}
        }
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: "Please enter an author."}
        }
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: "Genre is required."} 
        }
      },
      first_published: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: {msg: "Year should be of the format YYYY"}
        }
      }
    }, {
      classMethods: {
        associate: function(models) {
          books.hasMany(models.Loans, {foreignKey: 'book_id'});
 
        }
      },
      timestamps: false
    });
    return books;
  };