const {
  reverse
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView.transform(): reverse', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(populationChina);
  });

  it('api', () => {
    expect(getTransform('reverse')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'reverse'
    });
    expect(dataView.rows).to.eql(reverse(populationChina));
  });
});