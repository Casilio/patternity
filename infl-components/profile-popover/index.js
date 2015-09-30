'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _profilePopoverContent = require('./profile-popover-content');

var _profilePopoverContent2 = _interopRequireDefault(_profilePopoverContent);

var _popover = require('../popover');

var _popover2 = _interopRequireDefault(_popover);

var ProfilePopover = (function (_Component) {
  _inherits(ProfilePopover, _Component);

  function ProfilePopover() {
    var _this = this;

    _classCallCheck(this, ProfilePopover);

    _get(Object.getPrototypeOf(ProfilePopover.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      isOpen: false
    };

    this.triggerLink = function () {
      return _this.props.trigger || _react2['default'].createElement(
        'a',
        { className: 'profile-popover-link', href: 'javascript://' },
        _this.props.user.name
      );
    };

    this.togglePopover = function () {
      _this.setState({
        isOpen: !_this.state.isOpen
      });
    };
  }

  _createClass(ProfilePopover, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var onOpen = _props.onOpen;
      var trigger = _props.trigger;
      var user = _props.user;
      var defaultImage = _props.defaultImage;
      var underAvatar = _props.underAvatar;
      var loading = _props.loading;

      return _react2['default'].createElement(
        'div',
        { className: 'profile-popover-wrapper' + (loading ? ' loader' : '') },
        _react2['default'].createElement(
          _popover2['default'],
          {
            element: _react2['default'].createElement(
              'span',
              { onClick: this.togglePopover },
              this.triggerLink()
            ),
            onOpen: onOpen,
            position: 'bottom',
            isOpen: this.state.isOpen },
          _react2['default'].createElement(
            _profilePopoverContent2['default'],
            { user: user, defaultImage: defaultImage, underAvatar: underAvatar, loading: loading },
            children
          )
        )
      );
    }
  }], [{
    key: 'PropTypes',
    value: {
      user: _react.PropTypes.object.isRequired,
      defaultImage: _react.PropTypes.string,
      underAvatar: _react.PropTypes.node,
      onOpen: _react.PropTypes.func,
      loading: _react.PropTypes.bool,
      trigger: _react.PropTypes.node
    },
    enumerable: true
  }]);

  return ProfilePopover;
})(_react.Component);

exports['default'] = ProfilePopover;
module.exports = exports['default'];