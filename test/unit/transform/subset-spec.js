const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView.transform(): subset', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(populationChina);
  });

  it('api', () => {
    expect(getTransform('subset')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'subset'
    });
    expect(dataView.rows).to.eql(populationChina);
  });

  it('only specify endRowIndex', () => {
    dataView.transform({
      type: 'subset',
      endRowIndex: 2
    });
    expect(dataView.rows.length).to.equal(3);
    expect(dataView.getColumnNames().length).to.equal(2);
  });

  it('only specify startRowIndex', () => {
    dataView.transform({
      type: 'subset',
      startRowIndex: 1
    });
    expect(dataView.rows.length).to.equal(populationChina.length - 1);
    expect(dataView.getColumnNames().length).to.equal(2);
  });

  it('only specify columns', () => {
    dataView.transform({
      type: 'subset',
      fields: [ 'year' ]
    });
    expect(dataView.rows.length).to.equal(populationChina.length);
    expect(dataView.getColumnNames().length).to.equal(1);
  });

  it('specify all options', () => {
    dataView.transform({
      type: 'subset',
      startRowIndex: 1,
      endRowIndex: 2,
      fields: [ 'year' ]
    });
    expect(dataView.rows.length).to.equal(2);
    expect(dataView.getColumnNames().length).to.equal(1);
  });
});