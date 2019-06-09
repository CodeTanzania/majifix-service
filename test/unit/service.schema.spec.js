/* dependencies */
import { expect } from 'chai';

/* declarations */
import Service from '../../src/service.model';

describe('Service', () => {
  describe('Schema', () => {
    it('should have jurisdiction field', () => {
      const { jurisdiction } = Service.schema.tree;
      const { instance } = Service.schema.paths.jurisdiction;

      expect(instance).to.be.equal('ObjectID');
      expect(jurisdiction).to.exist;
      expect(jurisdiction).to.be.an('object');
      expect(jurisdiction.type).to.be.a('function');
      expect(jurisdiction.type.name).to.be.equal('ObjectId');
      expect(jurisdiction.index).to.be.true;
      expect(jurisdiction.exists).to.be.true;
    });

    it('should have group field', () => {
      const { group } = Service.schema.tree;
      const { instance } = Service.schema.paths.group;

      expect(instance).to.be.equal('ObjectID');
      expect(group).to.exist;
      expect(group).to.be.an('object');
      expect(group.type).to.be.a('function');
      expect(group.type.name).to.be.equal('ObjectId');
      expect(group.index).to.be.true;
      expect(group.exists).to.be.true;
    });

    it('should have priority field', () => {
      const { priority } = Service.schema.tree;
      const { instance } = Service.schema.paths.priority;

      expect(instance).to.be.equal('ObjectID');
      expect(priority).to.exist;
      expect(priority).to.be.an('object');
      expect(priority.type).to.be.a('function');
      expect(priority.type.name).to.be.equal('ObjectId');
      expect(priority.index).to.be.true;
      expect(priority.exists).to.be.true;
    });

    it('should have code field', () => {
      const { code } = Service.schema.tree;
      const { instance } = Service.schema.paths.code;

      expect(instance).to.be.equal('String');
      expect(code).to.exist;
      expect(code).to.be.an('object');
      expect(code.type).to.be.a('function');
      expect(code.type.name).to.be.equal('String');
      expect(code.required).to.be.true;
      expect(code.uppercase).to.be.true;
      expect(code.trim).to.be.true;
      expect(code.index).to.be.true;
      expect(code.searchable).to.be.true;
    });

    describe('name', () => {
      it('should be an embedded sub-document', () => {
        const { name } = Service.schema.tree;
        const { instance } = Service.schema.paths.name;
        const { tree } = Service.schema.tree.name;

        expect(instance).to.be.equal('Embedded');
        expect(name).to.exist;
        expect(name).to.be.an('object');
        expect(tree).to.exist;
        expect(tree.en).to.exist;
      });

      it('should have type `en` locale field', () => {
        const { instance } = Service.schema.paths.name.schema.paths.en;
        const { en } = Service.schema.tree.name.tree;

        expect(instance).to.be.equal('String');
        expect(en).to.exist;
        expect(en).to.be.an('object');
        expect(en.type).to.be.a('function');
        expect(en.type.name).to.be.equal('String');
        expect(en.required).to.be.true;
        expect(en.trim).to.be.true;
        expect(en.index).to.be.true;
        expect(en.required).to.be.true;
        expect(en.searchable).to.be.true;
      });
    });

    describe('description', () => {
      it('should be an embedded sub-document', () => {
        const { description } = Service.schema.tree;
        const { instance } = Service.schema.paths.description;
        const { tree } = Service.schema.tree.description;

        expect(instance).to.be.equal('Embedded');
        expect(description).to.exist;
        expect(description).to.be.an('object');
        expect(tree).to.exist;
        expect(tree.en).to.exist;
      });

      it('should have type `en` locale field', () => {
        const { instance } = Service.schema.paths.description.schema.paths.en;
        const { en } = Service.schema.tree.description.tree;

        expect(instance).to.be.equal('String');
        expect(en).to.exist;
        expect(en).to.be.an('object');
        expect(en.type).to.be.a('function');
        expect(en.type.name).to.be.equal('String');
        expect(en.trim).to.be.true;
        expect(en.index).to.be.true;
        expect(en.searchable).to.be.true;
      });
    });

    it('should have color field', () => {
      const { color } = Service.schema.tree;
      const { instance } = Service.schema.paths.color;

      expect(instance).to.be.equal('String');
      expect(color).to.exist;
      expect(color).to.be.an('object');
      expect(color.type).to.be.a('function');
      expect(color.type.name).to.be.equal('String');
      expect(color.trim).to.be.true;
      expect(color.default).to.be.exist;
    });

    describe('sla', () => {
      it('should be an embedded subdocument', () => {
        const { sla } = Service.schema.tree;
        const { instance } = Service.schema.paths.sla;
        const { tree } = Service.schema.paths.sla.schema;

        expect(instance).to.be.equal('Embedded');
        expect(sla).to.exist;
        expect(sla).to.be.an('object');
        expect(tree).to.exist;
        expect(tree.ttr).to.exist;
      });

      it('should have ttr field', () => {
        const { schema } = Service.schema.paths.sla;
        const { ttr } = schema.tree;
        const { instance } = schema.paths.ttr;

        expect(instance).to.be.equal('Number');
        expect(ttr).to.exist;
        expect(ttr).to.be.an('object');
        expect(ttr.type).to.be.a('function');
        expect(ttr.type.name).to.be.equal('Number');
        expect(ttr.default).to.exist;
      });
    });

    describe('flags', () => {
      it('should be an embedded subdocument', () => {
        const { flags } = Service.schema.tree;
        const { instance } = Service.schema.paths.flags;
        const { tree } = Service.schema.paths.flags.schema;

        expect(instance).to.be.equal('Embedded');
        expect(flags).to.exist;
        expect(flags).to.be.an('object');
        expect(tree).to.exist;
        expect(tree.external).to.exist;
        expect(tree.account).to.exist;
      });

      it('should have external flag field', () => {
        const { schema } = Service.schema.paths.flags;
        const { external } = schema.tree;
        const { instance } = schema.paths.external;

        expect(instance).to.be.equal('Boolean');
        expect(external).to.exist;
        expect(external).to.be.an('object');
        expect(external.type).to.be.a('function');
        expect(external.type.name).to.be.equal('Boolean');
        expect(external.default).to.be.exist;
      });

      it('should have account flag field', () => {
        const { schema } = Service.schema.paths.flags;
        const { account } = schema.tree;
        const { instance } = schema.paths.account;

        expect(instance).to.be.equal('Boolean');
        expect(account).to.exist;
        expect(account).to.be.an('object');
        expect(account.type).to.be.a('function');
        expect(account.type.name).to.be.equal('Boolean');
        expect(account.default).to.be.exist;
      });
    });
  });
});
