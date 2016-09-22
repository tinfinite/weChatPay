'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _util = require('./util');var _util2 = _interopRequireDefault(_util);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var requireData = {
  appid: true,
  partner_key: true,
  mch_id: true,
  device_info: false,
  nonce_str: true,
  sign: false,
  body: true,
  detail: false,
  attach: false,
  out_trade_no: true,
  fee_type: false,
  total_fee: true,
  spbill_create_ip: true,
  time_start: false,
  time_expire: false,
  goods_tag: false,
  notify_url: true,
  trade_type: true,
  limit_pay: false };


var URLS = {
  UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
  ORDER_QUERY: 'https://api.mch.weixin.qq.com/pay/orderquery',
  REFUND: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
  REFUND_QUERY: 'https://api.mch.weixin.qq.com/pay/refundquery',
  DOWNLOAD_BILL: 'https://api.mch.weixin.qq.com/pay/downloadbill',
  SHORT_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
  CLOSE_ORDER: 'https://api.mch.weixin.qq.com/pay/closeorder' };var


Payment =
function Payment(config) {var _this = this;(0, _classCallCheck3.default)(this, Payment);this.








  getReadyPayParams = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(order) {var default_params, params, vali, unifiRequired, _ref2, error, data, packageVal, payParams;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
              default_params = {
                out_trade_no: 'XSDX' + _util2.default._generateTimeStamp(), // 商户订单号XSDX+'时间戳'
                nonce_str: _util2.default._generateNonceStr() // 随机字符串，不长于32位
              };
              params = Object.assign({}, _this.config, default_params, order);
              console.log('getReadyPayParams.fullparams', params);
              vali = _util2.default.validate(params, requireData);if (!
              vali) {_context.next = 6;break;}throw (
                new Error('缺少参数' + vali));case 6:

              // 发送请求到微信
              unifiRequired = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];
              if (params.trade_type === 'JSAPI') {
                unifiRequired.push('openid');
              } else if (params.trade_type === 'NATIVE') {
                unifiRequired.push('product_id');
              }_context.next = 10;return (
                _this.sendRequestTWcPay(params, URLS.UNIFIED_ORDER, { required: unifiRequired }));case 10:_ref2 = _context.sent;error = _ref2.error;data = _ref2.data;
              console.log('getReadyPayParams.aftersendRequestTWcPay.result', data);if (!
              error) {_context.next = 16;break;}throw (
                error);case 16:

              // 返回参数重新生成sign,{app_id,partner_key,prepayid,nonce_str,timeStamp,package:prepay_id=}
              // APP与JSAPI生成签名的package字段的值不同
              packageVal = 'Sign=WXPay';
              if (params.trade_type === 'JSAPI') {
                packageVal = 'prepay_id=' + data.prepay_id;
              }
              payParams = null;
              if (params.trade_type === 'JSAPI') {
                payParams = Object.assign({}, {
                  appId: data.appid || _this.config.appid,
                  timeStamp: _util2.default._generateTimeStamp(),
                  nonceStr: _util2.default._generateNonceStr(),
                  package: packageVal,
                  signType: 'MD5' });

              } else {
                payParams = Object.assign({}, {
                  appid: data.appid || _this.config.appid,
                  partnerid: _this.config.mch_id,
                  prepayid: data.prepay_id,
                  timestamp: _util2.default._generateTimeStamp(),
                  noncestr: _util2.default._generateNonceStr(),
                  package: packageVal });

              }
              if (params.trade_type === 'JSAPI') {
                payParams.paySign = _util2.default._getSign(payParams, _this.config.partner_key);
              } else {
                payParams.sign = _util2.default._getSign(payParams, _this.config.partner_key);
              }

              if (order.trade_type === 'NATIVE') {
                payParams.code_url = data.code_url;
              }
              console.log('getReadyPayParams.result', payParams);return _context.abrupt('return',
              payParams);case 24:case 'end':return _context.stop();}}}, _callee, _this);}));return function (_x) {return _ref.apply(this, arguments);};}();this.






  sendRequestTWcPay = function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(params, url, options) {var body, _ref4, error, data;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                _util2.default.checkRequireData(params, options));case 2:
              params.sign = _util2.default._getSign(_util2.default.toString(params), _this.config.partner_key);
              delete params.partner_key;_context2.next = 6;return (
                _util2.default._httpRequest(url, _util2.default.buildXml(params)));case 6:body = _context2.sent;_context2.next = 9;return (
                _util2.default.validateBody(body, _this.config.partner_key));case 9:_ref4 = _context2.sent;error = _ref4.error;data = _ref4.data;return _context2.abrupt('return',
              { error: error, data: data });case 13:case 'end':return _context2.stop();}}}, _callee2, _this);}));return function (_x2, _x3, _x4) {return _ref3.apply(this, arguments);};}();this.



  getWcPayConfirmRequest = function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req) {var _error, rawBody, _ref6, error, data;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:if (!(
              req.method !== 'POST')) {_context3.next = 4;break;}
              _error = new Error();
              _error.name = 'NotImplemented';throw (
                _error);case 4:_context3.next = 6;return (

                _util2.default.getRawBody(req));case 6:rawBody = _context3.sent;_context3.next = 9;return (
                _util2.default.validateBody(rawBody, _this.config.partner_key));case 9:_ref6 = _context3.sent;error = _ref6.error;data = _ref6.data;return _context3.abrupt('return',
              { error: error, data: data });case 13:case 'end':return _context3.stop();}}}, _callee3, _this);}));return function (_x5) {return _ref5.apply(this, arguments);};}();this.






  getOrder = function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(params) {var default_params, obj, _ref8, error, data;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
              default_params = {
                nonce_str: _util2.default._generateNonceStr() // 随机字符串，不长于32位
              };
              obj = Object.assign({}, _this.config, default_params, params);_context4.next = 4;return (
                _this.sendRequestTWcPay(obj, URLS.ORDER_QUERY, { required: ['transaction_id|out_trade_no'] }));case 4:_ref8 = _context4.sent;error = _ref8.error;data = _ref8.data;if (!
              error) {_context4.next = 9;break;}throw (
                error);case 9:return _context4.abrupt('return',

              data);case 10:case 'end':return _context4.stop();}}}, _callee4, _this);}));return function (_x6) {return _ref7.apply(this, arguments);};}();this.


  closeOrder = function () {var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(params) {var _ref10, error, data;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                _this.sendRequestTWcPay(params, URLS.CLOSE_ORDER, { required: ['out_trade_no'] }));case 2:_ref10 = _context5.sent;error = _ref10.error;data = _ref10.data;if (!
              error) {_context5.next = 7;break;}throw (
                error);case 7:return _context5.abrupt('return',

              data);case 8:case 'end':return _context5.stop();}}}, _callee5, _this);}));return function (_x7) {return _ref9.apply(this, arguments);};}();this.


  refund = function () {var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(params) {var _ref12, error, data;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.next = 2;return (
                _this.sendRequestTWcPay(params, URLS.REFUND, { required: ['transaction_id|out_trade_no', 'out_refund_no', 'total_fee', 'refund_fee'] }));case 2:_ref12 = _context6.sent;error = _ref12.error;data = _ref12.data;if (!
              error) {_context6.next = 7;break;}throw (
                error);case 7:return _context6.abrupt('return',

              data);case 8:case 'end':return _context6.stop();}}}, _callee6, _this);}));return function (_x8) {return _ref11.apply(this, arguments);};}();this.


  refundQuery = function () {var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(params) {var _ref14, error, data;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.next = 2;return (
                _this.sendRequestTWcPay(params, URLS.REFUND_QUERY, { required: ['transaction_id|out_trade_no|out_refund_no|refund_id'] }));case 2:_ref14 = _context7.sent;error = _ref14.error;data = _ref14.data;if (!
              error) {_context7.next = 7;break;}throw (
                error);case 7:return _context7.abrupt('return',

              data);case 8:case 'end':return _context7.stop();}}}, _callee7, _this);}));return function (_x9) {return _ref13.apply(this, arguments);};}();this.


  downloadBill = function () {var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(params) {var _ref16, error, data;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:_context8.next = 2;return (
                _this.sendRequestTWcPay(params, URLS.DOWNLOAD_BILL, { required: ['bill_date', 'bill_type'] }));case 2:_ref16 = _context8.sent;error = _ref16.error;data = _ref16.data;if (!
              error) {_context8.next = 7;break;}throw (
                error);case 7:return _context8.abrupt('return',

              data);case 8:case 'end':return _context8.stop();}}}, _callee8, _this);}));return function (_x10) {return _ref15.apply(this, arguments);};}(); // this.app_id = config.appId;// APPID
  // this.mch_id = config.mchId;// 微信支付分配的商户号
  // this.notify_url = config.notifyUrl;// 支付成功后回调的url
  // partner_key
  this.config = config || {};} // 调用微信统一下单API，获取预订单的信息
// TODO:收货地址共享接口,Generate parameters for `WeixinJSBridge.invoke('editAddress', parameters)`.
// getEditAddressParams = async (params) => {
// }
// 接收微信付款确认请求
/**
 * @params{out_trade_no}
 * @config{appid,mch_id}
 */;exports.default = Payment;module.exports = exports['default'];