import { SchemaTypes } from '@lykmapipo/mongoose-common';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import Service from '../../src/service.model';

describe('Service Schema', () => {
  it('should have jurisdiction field', () => {
    const jurisdiction = Service.path('jurisdiction');

    expect(jurisdiction).to.exist;
    expect(jurisdiction).to.be.instanceof(SchemaTypes.ObjectID);
    expect(jurisdiction.options).to.exist;
    expect(jurisdiction.options).to.be.an('object');
    expect(jurisdiction.options.type).to.be.a('function');
    expect(jurisdiction.options.type.name).to.be.equal('ObjectId');
    expect(jurisdiction.options.ref).to.exist.and.be.equal('Jurisdiction');
    expect(jurisdiction.options.exists).to.exist.and.be.an('object');
    expect(jurisdiction.options.autopopulate).to.exist.and.an('object');
    expect(jurisdiction.options.index).to.be.true;
  });

  it('should have group field', () => {
    const group = Service.path('group');

    expect(group).to.exist;
    expect(group).to.be.instanceof(SchemaTypes.ObjectID);
    expect(group.options).to.exist;
    expect(group.options).to.be.an('object');
    expect(group.options.type).to.be.a('function');
    expect(group.options.type.name).to.be.equal('ObjectId');
    expect(group.options.ref).to.exist.and.be.equal('ServiceGroup');
    expect(group.options.required).to.be.true;
    expect(group.options.exists).to.exist.and.be.an('object');
    expect(group.options.autopopulate).to.exist.and.an('object');
    expect(group.options.index).to.be.true;
  });

  it('should have type field', () => {
    const type = Service.path('type');

    expect(type).to.exist;
    expect(type).to.be.instanceof(SchemaTypes.ObjectID);
    expect(type.options).to.exist;
    expect(type.options).to.be.an('object');
    expect(type.options.type).to.be.a('function');
    expect(type.options.type.name).to.be.equal('ObjectId');
    expect(type.options.ref).to.exist.and.be.equal('Predefine');
    expect(type.options.exists).to.exist.and.be.an('object');
    expect(type.options.autopopulate).to.exist.and.an('object');
    expect(type.options.index).to.be.true;
  });

  it('should have priority field', () => {
    const priority = Service.path('priority');

    expect(priority).to.exist;
    expect(priority).to.be.instanceof(SchemaTypes.ObjectID);
    expect(priority.options).to.exist;
    expect(priority.options).to.be.an('object');
    expect(priority.options.type).to.be.a('function');
    expect(priority.options.type.name).to.be.equal('ObjectId');
    expect(priority.options.ref).to.exist.and.be.equal('Priority');
    expect(priority.options.exists).to.exist.and.be.an('object');
    expect(priority.options.autopopulate).to.exist.and.an('object');
    expect(priority.options.index).to.be.true;
  });

  it('should have code field', () => {
    const code = Service.path('code');

    expect(code).to.exist;
    expect(code).to.be.instanceof(SchemaTypes.String);
    expect(code.options).to.exist;
    expect(code.options).to.be.an('object');
    expect(code.options.type).to.exist;
    expect(code.options.trim).to.be.true;
    expect(code.options.index).to.be.true;
    expect(code.options.searchable).to.be.true;
    expect(code.options.exportable).to.be.true;
    expect(code.options.fake).to.exist;
  });

  it('should have name field', () => {
    const name = Service.path('name');
    const en = Service.path('name.en');
    // const sw = Service.path('name.sw');

    expect(name).to.exist;

    expect(en).to.exist;
    expect(en).to.be.instanceof(SchemaTypes.String);
    expect(en.options).to.exist;
    expect(en.options).to.be.an('object');
    expect(en.options.type).to.exist;
    expect(en.options.trim).to.be.true;
    expect(en.options.required).to.be.true;
    expect(en.options.index).to.be.true;
    expect(en.options.searchable).to.be.true;
    expect(en.options.taggable).to.be.true;
    expect(en.options.exportable).to.be.true;
    expect(en.options.fake).to.exist;

    // expect(sw).to.exist;
    // expect(sw).to.be.instanceof(SchemaTypes.String);
    // expect(sw.options).to.exist;
    // expect(sw.options).to.be.an('object');
    // expect(sw.options.type).to.exist;
    // expect(sw.options.trim).to.be.true;
    // expect(sw.options.required).to.be.false;
    // expect(sw.options.index).to.be.true;
    // expect(sw.options.searchable).to.be.true;
    // expect(sw.options.taggable).to.be.true;
    // expect(sw.options.exportable).to.be.true;
    // expect(sw.options.fake).to.exist;
  });

  it('should have description field', () => {
    const description = Service.path('description');
    const en = Service.path('description.en');
    // const sw = Service.path('description.sw');

    expect(description).to.exist;

    expect(en).to.exist;
    expect(en).to.be.instanceof(SchemaTypes.String);
    expect(en.options).to.exist;
    expect(en.options).to.be.an('object');
    expect(en.options.type).to.exist;
    expect(en.options.trim).to.be.true;
    expect(en.options.required).to.be.true;
    expect(en.options.index).to.be.true;
    expect(en.options.searchable).to.be.true;
    expect(en.options.exportable).to.be.true;
    expect(en.options.fake).to.exist;

    // expect(sw).to.exist;
    // expect(sw).to.be.instanceof(SchemaTypes.String);
    // expect(sw.options).to.exist;
    // expect(sw.options).to.be.an('object');
    // expect(sw.options.type).to.exist;
    // expect(sw.options.trim).to.be.true;
    // expect(sw.options.required).to.be.false;
    // expect(sw.options.index).to.be.true;
    // expect(sw.options.searchable).to.be.true;
    // expect(sw.options.exportable).to.be.true;
    // expect(sw.options.fake).to.exist;
  });

  it('should have color field', () => {
    const color = Service.path('color');

    expect(color).to.exist;
    expect(color).to.be.instanceof(SchemaTypes.String);
    expect(color.options).to.exist;
    expect(color.options).to.be.an('object');
    expect(color.options.type).to.exist;
    expect(color.options.trim).to.be.true;
    expect(color.options.uppercase).to.be.true;
    expect(color.options.exportable).to.be.true;
    expect(color.options.fake).to.exist;
  });

  describe('sla', () => {
    it('should be an embedded subdocument', () => {
      const sla = Service.path('sla');

      expect(sla).to.exist;
      expect(sla.instance).to.be.equal('Embedded');
      expect(sla).to.be.an('object');
    });

    it('should have ttr field', () => {
      const ttr = Service.path('sla.ttr');

      expect(ttr).to.exist;
      expect(ttr).to.be.instanceof(SchemaTypes.Number);
      expect(ttr.options.type).to.be.a('function');
      expect(ttr.options.type.name).to.be.equal('Number');
      expect(ttr.options.exportable).to.be.true;
      expect(ttr.options.index).to.be.true;
      expect(ttr.options.default).to.exist;
      expect(ttr.options.fake).to.exist;
    });
  });

  describe('flags', () => {
    it('should be an embedded subdocument', () => {
      const flags = Service.path('flags');

      expect(flags).to.exist;
      expect(flags.instance).to.be.equal('Embedded');
      expect(flags).to.be.an('object');
    });

    it('should have external flag field', () => {
      const external = Service.path('flags.external');

      expect(external).to.exist;
      expect(external).to.be.instanceof(SchemaTypes.Boolean);
      expect(external.options).to.exist;
      expect(external.options).to.be.an('object');
      expect(external.options.type).to.be.a('function');
      expect(external.options.type.name).to.be.equal('Boolean');
      expect(external.options.index).to.be.true;
      expect(external.options.exportable).to.be.true;
      expect(external.options.default).to.exist;
      expect(external.options.fake).to.exist;
    });

    it('should have account flag field', () => {
      const account = Service.path('flags.account');

      expect(account).to.exist;
      expect(account).to.be.instanceof(SchemaTypes.Boolean);
      expect(account.options).to.exist;
      expect(account.options).to.be.an('object');
      expect(account.options.type).to.be.a('function');
      expect(account.options.type.name).to.be.equal('Boolean');
      expect(account.options.index).to.be.true;
      expect(account.options.exportable).to.be.true;
      expect(account.options.default).to.exist;
      expect(account.options.fake).to.exist;
    });
  });

  it('should have default field', () => {
    const isDefault = Service.path('default');

    expect(isDefault).to.exist;
    expect(isDefault).to.be.instanceof(SchemaTypes.Boolean);
    expect(isDefault.options).to.exist;
    expect(isDefault.options).to.be.an('object');
    expect(isDefault.options.type).to.exist;
    expect(isDefault.options.index).to.be.true;
    expect(isDefault.options.exportable).to.be.true;
    expect(isDefault.options.default).to.be.false;
    expect(isDefault.options.fake).to.exist;
  });
});
