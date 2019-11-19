"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Intellect = "/assets/intellect.png";

var customTabBar = (_temp2 = _class = function (_BaseComponent) {
  _inherits(customTabBar, _BaseComponent);

  function customTabBar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, customTabBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = customTabBar.__proto__ || Object.getPrototypeOf(customTabBar)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray2", "Intellect", "selected", "color", "selectedColor", "list", "ind"], _this.state = {
      selected: 0,
      color: '#666',
      selectedColor: '#ed6c00',
      list: [{
        pagePath: '/pages/index/index',
        iconPath: '/assets/home.png',
        selectedIconPath: '/assets/home-active.png',
        text: '主页'
      }, {
        pagePath: '/pages/user/user',
        iconPath: '/assets/user.png',
        selectedIconPath: '/assets/user-active.png',
        text: '我的'
      }]
    }, _this.switchTab = function (item) {
      var url = item.pagePath;
      _index2.default.switchTab({
        url: url
      });
    }, _this.jumpIntellect = function () {
      _index2.default.navigateTo({ url: '/pages/intellect/intellect' });
    }, _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(customTabBar, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(customTabBar.prototype.__proto__ || Object.getPrototypeOf(customTabBar.prototype), "_constructor", this).call(this, props);

      this.$$refs = [];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        selected: this.props.ind
      });
    }

    // 自定义 tabBar的页面

  }, {
    key: "_createData",
    value: function _createData() {
      var _this2 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;

      var loopArray2 = this.__state.list.map(function (item, index) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };
        var $loopState__temp2 = (0, _index.internal_inline_style)({ color: _this2.__state.selected === index ? _this2.__state.selectedColor : _this2.__state.color });
        return {
          $loopState__temp2: $loopState__temp2,
          $original: item.$original
        };
      });

      Object.assign(this.__state, {
        loopArray2: loopArray2,
        Intellect: Intellect
      });
      return this.__state;
    }
  }]);

  return customTabBar;
}(_index.Component), _class.$$events = ["switchTab", "jumpIntellect"], _class.$$componentPath = "custom-tab-bar/index", _temp2);
exports.default = customTabBar;

Component(require('../npm/@tarojs/taro-weapp/index.js').default.createComponent(customTabBar));