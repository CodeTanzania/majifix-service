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
          select: {
            jurisdiction: 1,
            group: 1,
            priority: 1,
            code: 1,
            name: 1,
            color: 1
          },
          maxDepth: 1
        });
    });

  });


  describe('open311', function () {

    it('should be able to convert service to open311 format',
      function () {
        const service = Service.fake();
        const object = service.toOpen311();

        /* jshint camelcase:false*/
        expect(object.service_code).to.exist;
        expect(object.service_name).to.exist;
        expect(object.description).to.exist;
        expect(object.metadata).to.exist;
        expect(object.type).to.exist;
        expect(object.keywords).to.exist;

        /* jshint camelcase:true*/

      });

  });

});
