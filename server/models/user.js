const utils = require('../lib/hashUtils');
const Model = require('./model');
const mysql = require('mysql');
const db = require('../db/index.js');

//../db

/**
 * Users is a class with methods to interact with the users table, which
 * stores information (id, username, hashed password, salt) about users.
 * @constructor
 * @augments Model
 */
class Users extends Model {
  constructor() {
    super('users');
  }

  /**
   * Compares a password attempt with the previously stored password and salt.
   * @param {string} attempted - The attempted password.
   * @param {string} password - The hashed password from when the user signed up.
   * @param {string} salt - The salt generated when the user signed up.
   * @returns {boolean} A boolean indicating if the attempted password was correct.
   */
  compare(attempted, password, salt) {
    return utils.compareHash(attempted, password, salt);
  }

  /**
   * Creates a new user record with the given username and password.
   * This method creates a salt and hashes the password before storing
   * the username, hashed password, and salt in the database.
   * @param {Object} user - The user object.
   * @param {string} user.username - The user's username.
   * @param {string} user.password - The plaintext password.
   * @returns {Promise<Object>} A promise that is fulfilled with the result of
   * the record creation or rejected with the error that occured.
   */
  create({ username, password }) {
    let salt = utils.createRandom32String();

    let newUser = {
      username,
      salt,
      password: utils.createHash(password, salt)
    };

    return super.create.call(this, newUser);
  }

  // method that finds if username exists, if not creates user
  // if username does exist, message to page
  // findOrCreate({ username, password }) {
  //   const queryString = `select username from users where (username = '${username}')`;
  //   db.query(queryString, (err, results) => {
  //     if (err) { console.error(err) }
  //     else if (results.length !== 0) { // username exists
  //       // TODO: make sure error message gets to user
  //       console.log('Username exists. Please choose another username.');
  //       return true;
  //     } else {
  //       this.create.call(this,{ username, password });
  //       return false;
  //     }
  //   });
  // }

  // method that queries database for password and salt linked to username
  getPasswordandSalt(username, password) {
    const queryString = `select password, salt from users where (username = '${username}')`;
    db.query(queryString, (err, results) => {
      // console.log(results);
      if (err) { console.error(err) }
      else{
        var attempted = password;
        if (this.compare(attempted, results[0].password, results[0].salt)) {
          console.log('true');
        } else {
          console.log('false');
        }
      }
    });
  }
}

module.exports = new Users();