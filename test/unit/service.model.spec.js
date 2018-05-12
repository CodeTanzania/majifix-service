'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Service =
  require(path.join(__dirname, '..', '..', 'lib', 'service.model'));


describe('Service', function () {

  describe('Statics', function () {

    it('should expose model name as constant', function () {
      expect(Service.MODEL_NAME).to.exist;
      expect(Service.MODEL_NAME).to.be.equal('Service');
    });

    it('should expose autopulate as options', function () {
      expect(Service.OPTION_AUTOPOPULATE).to.exist;
      expect(Service.OPTION_AUTOPOPULATE)
        .to.be.eql({
          select: { description: 0 },
          maxDepth: 1
        });
    });

  });

});