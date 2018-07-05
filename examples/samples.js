'use strict';

/* dependencies */
const _ = require('lodash');
const faker = require('@benmaruchu/faker');

function sample(n = 3) {
  return {
    code: faker.finance.account(),
    name: { en: faker.hacker.ingverb(), sw: faker.hacker.ingverb() },
    description: { en: faker.lorem.paragraph(), sw: faker.lorem.paragraph() },
    flags: {
      external: (n % 2 > 0 ? true : false),
      account: (n % 2 > 0 ? true : false)
    }
  };
}

module.exports = function (size = 10) {
  size = size > 0 ? size : 10;
  return _.times(size, sample);
};
