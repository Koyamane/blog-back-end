'use strict';

class MyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.stack = new Error().stack;
  }
}

module.exports = MyError;
