'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _utility = require('utility');var _utility2 = _interopRequireDefault(_utility);
var _xml2js = require('xml2js');var _xml2js2 = _interopRequireDefault(_xml2js);
var _request = require('request');var _request2 = _interopRequireDefault(_request);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var RETURN_CODES = { 
  SUCCESS: 'SUCCESS', 
  FAIL: 'FAIL' };


var validate = function validate(obj, requireData) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = Object.keys(requireData)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var key = _step.value;
      if (requireData[key]) {
        if (!obj[key]) {
          return key;}}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}



  return null;};


var _generateTimeStamp = function _generateTimeStamp() {return '' + parseInt(+new Date() / 1000, 10);};

var _generateNonceStr = function _generateNonceStr(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxPos = chars.length;
  var noceStr = '';
  for (var i = 0; i < (length || 32); i++) {
    noceStr += chars.charAt(Math.floor(Math.random() * maxPos));}

  return noceStr;};


var toString = function toString(params) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
    for (var _iterator2 = Object.keys(params)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var key = _step2.value;
      if (params[key] !== undefined && params[key] !== null) {
        params[key] = params[key].toString();}}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}};




var _toQueryString = function _toQueryString(object) {return (
    Object.keys(object).filter(function (key) {return object[key] !== undefined && object[key] !== '';}).sort().
    map(function (key) {return key + '=' + object[key];}).
    join('&'));};

var _getSign = function _getSign(params) {
  var pkg = Object.assign({}, params);
  var partnerKey = pkg.partnerKey;
  delete pkg.partnerKey;
  var string1 = _toQueryString(pkg);
  var stringSignTemp = string1 + '&key=' + partnerKey;
  return _utility2.default.md5(stringSignTemp).toUpperCase();};


var buildXml = function buildXml(obj) {
  var builder = new _xml2js2.default.Builder();
  return builder.buildObject({ xml: obj });};


var _httpRequest = function _httpRequest(url, data) {return new Promise(function (reslove, reject) {
    (0, _request2.default)({ 
      url: url, 
      method: 'POST', 
      body: data }, 
    function (err, response, body) {
      if (err) {
        reject(err);}

      reslove(body);});});};



var validateBody = function validateBody(body) {return new Promise(function (reslove, reject) {
    _xml2js2.default.parseString(body, { 
      trim: true, 
      explicitArray: false }, 
    function (err, json) {
      if (err) {
        err.name = 'XMLParseError';
        reject(err);}


      var error = null;
      var data = json ? json.xml : {};

      if (data.return_code === RETURN_CODES.FAIL) {
        error = new Error(data.return_msg);
        error.name = 'ProtocolError';} else 
      if (data.result_code === RETURN_CODES.FAIL) {
        error = new Error(data.err_code);
        error.name = 'BusinessError';} else 
      if (self.appId !== data.appid) {
        error = new Error();
        error.name = 'InvalidAppId';} else 
      if (self.mchId !== data.mch_id) {
        error = new Error();
        error.name = 'InvalidMchId';} else 
      if (self._getSign(data) !== data.sign) {
        error = new Error();
        error.name = 'InvalidSignature';}


      reslove({ error: error, data: data });});});};



var getRawBody = function getRawBody(req) {return new Promise(function (reslove, reject) {
    if (req.rawBody) {
      reslove(req.rawBody);}


    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      data += chunk;});


    req.on('end', function () {
      req.rawBody = data;
      reslove(data);});});};



var checkRequireData = function checkRequireData(params, options) {return new Promise(function (reslove, reject) {
    var required = options.required || [];
    var missing = [];
    required.forEach(function (key) {
      var alters = key.split('|');
      for (var i = alters.length - 1; i >= 0; i--) {
        if (params[alters[i]]) {
          return;}}


      missing.push(key);});


    if (missing.length) {
      reject(new Error('missing params :\' ' + missing.join(',')));}

    reslove('reslove');});};exports.default = 


{ 
  validate: validate, 
  _generateTimeStamp: _generateTimeStamp, 
  _generateNonceStr: _generateNonceStr, 
  toString: toString, 
  _getSign: _getSign, 
  buildXml: buildXml, 
  _httpRequest: _httpRequest, 
  validateBody: validateBody, 
  getRawBody: getRawBody, 
  checkRequireData: checkRequireData };module.exports = exports['default'];