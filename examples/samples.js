'use strict';

/* depedencies */
const _ = require('lodash');
const faker = require('faker');

function sample(n = 3) {
  return {
    code: faker.finance.account(),
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    isExternal: n % 2 > 0 ? true : false
  };
}

module.exports = function (size = 10) {
  size = size > 0 ? size : 10;
  return _.times(size, sample);
};