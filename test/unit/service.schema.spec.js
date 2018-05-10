'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Service =
  require(path.join(__dirname, '..', '..', 'lib', 'service.model'));


describe('Service', function () {

  describe('Schema', function () {

    it('should have jurisdiction field', function () {

      const jurisdiction = Service.schema.tree.jurisdiction;
      const instance = Service.schema.paths.jurisdiction.instance;

      expect(instance).to.be.equal('ObjectID');
      expect(jurisdiction).to.exist;
      expect(jurisdiction).to.be.an('object');
      expect(jurisdiction.type).to.be.a('function');
      expect(jurisdiction.type.name).to.be.equal('ObjectId');
      expect(jurisdiction.index).to.be.true;
      expect(jurisdiction.exists).to.be.true;
      expect(jurisdiction.autoset).to.be.true;

    });

    it('should have group field', function () {

      const group = Service.schema.tree.group;
      const instance = Service.schema.paths.group.instance;

      expect(instance).to.be.equal('ObjectID');
      expect(group).to.exist;
      expect(group).to.be.an('object');
      expect(group.type).to.be.a('function');
      expect(group.type.name).to.be.equal('ObjectId');
      expect(group.index).to.be.true;
      expect(group.exists).to.be.true;
      expect(group.autoset).to.be.true;

    });

    it('should have priority field', function () {

      const priority = Service.schema.tree.priority;
      const instance = Service.schema.paths.priority.instance;

      expect(instance).to.be.equal('ObjectID');
      expect(priority).to.exist;
      expect(priority).to.be.an('object');
      expect(priority.type).to.be.a('function');
      expect(priority.type.name).to.be.equal('ObjectId');
      expect(priority.index).to.be.true;
      expect(priority.exists).to.be.true;
      expect(priority.autoset).to.be.true;

    });

    it('should have code field', function () {

      const code = Service.schema.tree.code;
      const instance = Service.schema.paths.code.instance;

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

    it.skip('should have name field', function () {

      const name = Service.schema.tree.name;
      const instance = Service.schema.paths.name.instance;

      expect(instance).to.be.equal('String');
      expect(name).to.exist;
      expect(name).to.be.an('object');
      expect(name.type).to.be.a('function');
      expect(name.type.name).to.be.equal('String');
      expect(name.required).to.be.true;
      expect(name.trim).to.be.true;
      expect(name.index).to.be.true;
      expect(name.searchable).to.be.true;

    });


    it.skip('should have description field', function () {

      const description = Service.schema.tree.description;
      const instance = Service.schema.paths.description.instance;

      expect(instance).to.be.equal('String');
      expect(description).to.exist;
      expect(description).to.be.an('object');
      expect(description.type).to.be.a('function');
      expect(description.type.name).to.be.equal('String');
      expect(description.trim).to.be.true;
      expect(description.searchable).to.be.true;
      expect(description.index).to.be.true;

    });

    it('should have color field', function () {

      const color = Service.schema.tree.color;
      const instance = Service.schema.paths.color.instance;

      expect(instance).to.be.equal('String');
      expect(color).to.exist;
      expect(color).to.be.an('object');
      expect(color.type).to.be.a('function');
      expect(color.type.name).to.be.equal('String');
      expect(color.trim).to.be.true;
      expect(color.default).to.be.exist;

    });

    describe.skip('sla', function () {

      it('should be an embedded subdocument', function () {

        const sla = Service.schema.tree.sla;
        const instance = Service.schema.paths.sla.instance;
        const tree = Service.schema.paths.sla.schema.tree;

        expect(instance).to.be.equal('Embedded');
        expect(sla).to.exist;
        expect(sla).to.be.an('object');
        expect(tree).to.exist;
        expect(tree.ttr).to.exist;

      });

      it('should have ttr field', function () {

        const schema = Service.schema.paths.sla.schema;
        const ttr = schema.tree.ttr;
        const instance = schema.paths.ttr.instance;

        expect(instance).to.be.equal('Number');
        expect(ttr).to.exist;
        expect(ttr).to.be.an('object');
        expect(ttr.type).to.be.a('function');
        expect(ttr.type.name).to.be.equal('Number');
        expect(ttr.default).to.exist;

      });


    });


    it('should have isExternal field', function () {

      const isExternal = Service.schema.tree.isExternal;
      const instance = Service.schema.paths.isExternal.instance;

      expect(instance).to.be.equal('Boolean');
      expect(isExternal).to.exist;
      expect(isExternal).to.be.an('object');
      expect(isExternal.type).to.be.a('function');
      expect(isExternal.type.name).to.be.equal('Boolean');
      expect(isExternal.default).to.be.exist;

    });

  });

});