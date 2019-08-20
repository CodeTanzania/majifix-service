/* dependencies */
import { expect } from 'chai';

/* declarations */
import Service from '../../src/service.model';

describe('Service', () => {
  describe('Statics', () => {
    it('should expose model name as constant', () => {
      expect(Service.MODEL_NAME).to.exist;
      expect(Service.MODEL_NAME).to.be.equal('Service');
    });

    it('should expose select as options', () => {
      expect(Service.OPTION_SELECT).to.exist;
      expect(Service.OPTION_SELECT).to.be.eql({
        jurisdiction: 1,
        group: 1,
        priority: 1,
        code: 1,
        name: 1,
        color: 1,
      });
    });

    it('should expose autopulate as options', () => {
      expect(Service.OPTION_AUTOPOPULATE).to.exist;
      expect(Service.OPTION_AUTOPOPULATE).to.be.eql({
        select: {
          jurisdiction: 1,
          group: 1,
          priority: 1,
          code: 1,
          name: 1,
          color: 1,
        },
        maxDepth: 1,
      });
    });
  });

  describe('open311', () => {
    it('should be able to convert service to open311 format', () => {
      const service = Service.fake();
      const object = service.toOpen311();

      expect(object.service_code).to.exist;
      expect(object.service_name).to.exist;
      expect(object.description).to.exist;
      expect(object.metadata).to.exist;
      expect(object.type).to.exist;
      expect(object.keywords).to.exist;
    });
  });
});
