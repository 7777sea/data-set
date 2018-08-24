/*
 * kernel density estimation
 */
const assign = require('@antv/util/lib/mix');
const each = require('@antv/util/lib/each');
const isArray = require('@antv/util/lib/type/isArray');
const isFunction = require('@antv/util/lib/type/isFunction');
const isNumber = require('@antv/util/lib/type/isNumber');
const isString = require('@antv/util/lib/type/isString');
const keys = require('@antv/util/lib/object/keys');
// const regression = require('regression');
const getSeriesValues = require('../util/get-series-values');
// const enclideanDistance = require('../util/euclidean-distance');
const kernel = require('../util/kernel');
const bandwidth = require('../util/bandwidth');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');
const {
  kernelDensityEstimation
} = require('simple-statistics');

const DEFAULT_OPTIONS = {
  minY: 0.01,
  as: [ 'key', 'x', 'y' ],
  // fields: [ 'y1', 'y2' ], // required, one or two fields
  extent: [], // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  method: 'gaussian', // kernel method: should be one of keys(kernel)
  bandwidth: 'nrd' // bandwidth method to execute kernel function // nrd, silverman or a fixed bandwidth value
};

const KERNEL_METHODS = keys(kernel);
const BANDWIDTH_METHODS = keys(bandwidth);

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length < 1) {
    throw new TypeError('invalid fields: must be an array of at least 1 strings!');
  }
  const as = options.as;
  if (!isArray(as) || as.length !== 3) {
    throw new TypeError('invalid as: must be an array of 3 strings!');
  }
  let method = options.method;
  if (isString(method)) {
    if (KERNEL_METHODS.indexOf(method) === -1) {
      throw new TypeError(`invalid method: ${method}. Must be one of ${KERNEL_METHODS.join(', ')}`);
    }
    method = kernel[method];
  }
  if (!isFunction(method)) {
    throw new TypeError('invalid method: kernel method must be a function!');
  }

  let extent = options.extent;
  if (!isArray(extent) || extent.length === 0) {
    let rangeArr = [];
    each(fields, field => {
      const range = dv.range(field);
      rangeArr = rangeArr.concat(range);
    });
    extent = [ Math.min(...rangeArr), Math.max(...rangeArr) ];
  }
  let bw = options.bandwidth;
  if (isString(bw) && bandwidth[bw]) {
    bw = bandwidth[bw](dv.getColumn(fields[0]));
  } else if (isFunction(bw)) {
    bw = bw(dv.getColumn(fields[0]));
  } else if (!isNumber(bw) || bw <= 0) {
    bw = bandwidth.nrd(dv.getColumn(fields[0]));
  }
  const seriesValues = getSeriesValues(extent, bw);
  const result = [];

  const probalityDensityFunctionByField = {};
  each(fields, field => {
    probalityDensityFunctionByField[field] = kernelDensityEstimation(dv.getColumn(field), method, bw);
    const row = {};
    const [ key, x, y ] = as;
    row[key] = field;
    row[x] = [];
    row[y] = [];
    each(seriesValues, xValue => {
      const yValue = probalityDensityFunctionByField[field](xValue);
      if (yValue >= options.minY) {
        row[x].push(xValue);
        row[y].push(yValue);
      }
    });

    result.push(row);
  });

  dv.rows = result;
}

registerTransform('kernel-density-estimation', transform);
registerTransform('kde', transform);
registerTransform('KDE', transform);

module.exports = {
  KERNEL_METHODS,
  BANDWIDTH_METHODS
};