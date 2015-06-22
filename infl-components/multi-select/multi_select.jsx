var React = require('react');
var $ = require('jquery');
var _ = require('lodash');

var ClearAll = require('./clear_all.jsx');
var NativeSelect = require('./native_select.jsx');
var SelectedOptions = require('./selected_options.jsx');
var MultiSelectOptionsList = require('./multi_select_options_list.jsx');

var DOWN_ARROW_KEY_CODE = 40;
var UP_ARROW_KEY_CODE = 38;
var ENTER_KEY_CODE = 13;
var BACK_SPACE_KEY_CODE = 8;
var DELETE_KEY_CODE = 46;
var ESCAPE_KEY_CODE = 27;
var TAB_KEY_CODE = 9;

var acceptedKeyCodes = [DOWN_ARROW_KEY_CODE, UP_ARROW_KEY_CODE, ENTER_KEY_CODE, BACK_SPACE_KEY_CODE, DELETE_KEY_CODE, ESCAPE_KEY_CODE, TAB_KEY_CODE];

var MultiSelect = React.createClass({
  propTypes: {
    options: React.PropTypes.array,
    name : React.PropTypes.string,
    onOptionChange : React.PropTypes.func,
    onTypeAheadChange : React.PropTypes.func
  },

  getDefaultProps : function(){
    return {
      options : [],
      name : "multiSelect",
      onOptionChange : function(){},
      onTypeAheadChange : function(){}
    };
  },

  getInitialState : function(){
    return {
      typeAhead : "",
      options : [],
      selectedOptions : [],
      showOptions : false,
      placeholder : true,
      focusedOption : {}
    };
  },

  componentWillReceiveProps : function(nextProps){
    this._preProcessOptions(nextProps.options);
  },

  componentWillMount : function(){
    this._preProcessOptions(this.props.options);
    this._addHideEvent();
  },

  componentWillUnmount : function(){
    this._removeHideEvent();
  },

  componentDidMount : function(){
    this._adjustPopoverSize();
    this._adjustPopoverPosition();
  },

  componentDidUpdate : function(){
    this._adjustPopoverSize();
    this._adjustPopoverPosition();
    this._handleOptionChange();
  },

  render: function() {
    return (
      <span ref="multiSelectContainer" className={"pt-multi-select " + this._areOptionsVisible()} onKeyDown={this._handleKeyDown}>
        <ClearAll hasSelectedOptions={this._hasSelectedOptions()} onClearAll={this._handleClearAll}/>

        <span className="multi-select" onClick={this._showOptions}>
          <SelectedOptions
            options={this.state.selectedOptions}
            removeSelectedOption={this._handleSelectedOptionRemoved}
            showPlaceholder={this.state.placeholder}
            typeAhead={this.state.typeAhead}
            handleTypeAheadChange={this._handleTypeAheadChange} />
        </span>

        <NativeSelect
          selectedOptions={this.state.selectedOptions}
          name={this.props.name} />

        <MultiSelectOptionsList
          ref="popover"
          handleOptionSelect={this._handleOptionSelect}
          options={this.state.options}
          showOptions={this.state.showOptions}
          onOptionHasFocus={this._handleOptionHasFocus}
          focusedOption={this.state.focusedOption} />
      </span>
    );
  },

  _handleOptionHasFocus : function(option){
    this.setState({
      focusedOption : option
    });
  },

  _handleKeyDown : function(event){
    if(event.keyCode === TAB_KEY_CODE){
      event.preventDefault();
    }

    if(acceptedKeyCodes.indexOf(event.keyCode) > -1){
      event.stopPropagation();
      this._determineKeyCodeAction(event.keyCode);
    }
  },

  _determineKeyCodeAction : function(keyCode){
    if(keyCode === ENTER_KEY_CODE){
      if(this._anyOptionsToShow()){
        this._handleOptionSelect(this.state.focusedOption);
      }
    } else if(keyCode === BACK_SPACE_KEY_CODE || keyCode === DELETE_KEY_CODE) {
      if(this.state.selectedOptions.length > 0 && this.state.typeAhead.length === 0){
        this._handleSelectedOptionRemoved(this.state.selectedOptions[this.state.selectedOptions.length - 1]);
      }
    } else if(keyCode === DOWN_ARROW_KEY_CODE || keyCode === TAB_KEY_CODE){
      if(this._anyOptionsToShow()){
        this._nextFocusedOption();
      }
    } else if(keyCode === UP_ARROW_KEY_CODE){
      if(this._anyOptionsToShow()){
        this._previousFocusedOption();
      }
    } else if(keyCode === ESCAPE_KEY_CODE){
      this._hideOptions();
    }
  },

  // duplicate from multi_select_options.  needs refactor
  _anyOptionsToShow : function(){
    var optionsToShow = false;

    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false){
        optionsToShow = true;
        break;
      }
    }

    return optionsToShow;
  },

  _nextFocusedOption : function(){
    var currentFocusedOptionIndex = -1;
    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].name === this.state.focusedOption.name && this.state.options[i].value === this.state.focusedOption.value) {
        currentFocusedOptionIndex = i;
        break;
      }
    }

    var nextFocusedOption = {};
    for(var i = 0; i < this.state.options.length; i++){
      if(i > currentFocusedOptionIndex && this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false) {
        nextFocusedOption = this.state.options[i]
        break;
      }
    }

    if(_.isEmpty(nextFocusedOption)){
      for(var i = 0; i < this.state.options.length; i++){
        if(this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false) {
          nextFocusedOption = this.state.options[i]
          break;
        }
      }
    }

    this.setState({
      focusedOption : nextFocusedOption
    });
  },

  _previousFocusedOption : function(){
    var currentFocusedOptionIndex = -1;
    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].name === this.state.focusedOption.name && this.state.options[i].value === this.state.focusedOption.value) {
        currentFocusedOptionIndex = i;
        break;
      }
    }

    var previousFocusedOption = {};
    for(var i = this.state.options.length - 1; i >= 0 ; i--){
      if(i < currentFocusedOptionIndex && this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false) {
        previousFocusedOption = this.state.options[i]
        break;
      }
    }

    if(_.isEmpty(previousFocusedOption)){
      for(var i = this.state.options.length - 1; i >= 0; i--){
        if(this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false) {
          previousFocusedOption = this.state.options[i]
          break;
        }
      }
    }

    this.setState({
      focusedOption : previousFocusedOption
    });
  },

  _addHideEvent : function(){
    var that = this;
    $(window).click(function(){
      that._hideOptions();
    });
  },

  _hideOptions : function(){
    this.setState({
      showOptions : false,
      typeAhead : ""
    });

    this._resetInputWidth();
  },

  _removeHideEvent : function(){
    $(window).unbind("click");
  },

  _preProcessOptions : function(options){
    var modifiedOptions = options;

    for(var i = 0; i < modifiedOptions.length; i++){
      modifiedOptions[i].optionIsSelected = false;
      modifiedOptions[i].filteredOption = false;
    }

    var that = this;
    this.setState({
      options : modifiedOptions,
      focusedOption : modifiedOptions[0]
    });
  },

  _adjustPopoverSize : function(){
    var popover = React.findDOMNode(this.refs.popover);
    var multiSelectContainer = React.findDOMNode(this.refs.multiSelectContainer);
    popover.style.width = multiSelectContainer.offsetWidth + "px";
  },

  _adjustPopoverPosition : function(){
    var popover = React.findDOMNode(this.refs.popover);
    var multiSelectContainer = React.findDOMNode(this.refs.multiSelectContainer);
    popover.style.top = (multiSelectContainer.clientHeight - 1) + "px";
  },

  _handleOptionChange : function(){
    var newlyAddedOption = this.state.selectedOptions[this.state.selectedOptions.length - 1];
    this.props.onOptionChange(newlyAddedOption, this.state.selectedOptions);
  },

  _hasSelectedOptions : function(){
    return this.state.selectedOptions.length > 0;
  },

  _handleClearAll : function(){
    var currentOptions = this.state.options;

    for(var i = 0; i < this.state.options.length; i ++){
      currentOptions[i].optionIsSelected =  false;
      currentOptions[i].filteredOption =  false;
    }

    this.setState({
      options : currentOptions,
      selectedOptions : [],
      placeholder : true,
      typeAhead : ""
    });
  },

  _areOptionsVisible : function(){
    return this.state.showOptions ? "open" : "";
  },

  _showOptions : function(event){
    event.stopPropagation();

    document.getElementById("type-ahead").focus();

    this.setState({
      showOptions : true
    });
  },

  _handleTypeAheadChange : function(event){
    event.stopPropagation();

    this.props.onTypeAheadChange(event.target.value);
    this._adjustInputWidth(event.target);

    var filteredOptions = this._filterOptions(event.target.value.toLowerCase());

    var showPlaceholder = false;
    if(event.target.value.length === 0 && this.state.selectedOptions.length === 0){
      showPlaceholder = true;
    }

    if(event.target.value.length === 0){
      this._resetInputWidth();
    }

    var focusedOption = {};
    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].optionIsSelected === false && this.state.options[i].filteredOption === false) {
        focusedOption = this.state.options[i]
        break;
      }
    }

    this.setState({
      typeAhead : event.target.value,
      options : filteredOptions,
      placeholder : showPlaceholder,
      focusedOption : focusedOption
    });
  },

  _adjustInputWidth : function(input){
    input.style.width = (input.value.length + 1) * 8 + "px";
  },

  _resetInputWidth : function(){
    document.getElementById("type-ahead").style.width = "";
  },

  _filterOptions : function(filterText){
    var filteredOptions = this.state.options;

    if(filterText.length === 0){
      for(var i = 0; i < this.state.options.length; i++){
        filteredOptions[i].filteredOption = false;
      }
      return filteredOptions;
    }

    var filteredOptions = this.state.options;

    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].name.toLowerCase().indexOf(filterText) === 0){
        filteredOptions[i].filteredOption = false;
      } else {
        filteredOptions[i].filteredOption = true;
      }
    }

    return filteredOptions;
  },

  _handleOptionSelect : function(option){
    var currentSelectedOptions = this.state.selectedOptions;
    currentSelectedOptions.push(option);

    var currentOptions = this.state.options;
    for(var i = 0; i < this.state.options.length; i++){
      currentOptions[i].filteredOption = false;
    }

    this._resetInputWidth();

    var that = this;
    this.setState({
      selectedOptions : currentSelectedOptions,
      typeAhead : "",
      placeholder : false,
      options : currentOptions
    }, function(){
      document.getElementById("type-ahead").focus();
      that._hideSelectedOptionFromOptions(option);
    });
  },

  _hideSelectedOptionFromOptions : function(option){
    var currentOptions = this.state.options;

    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].name === option.name && this.state.options[i].value === option.value){
        currentOptions[i].optionIsSelected = true;
        break;
      }
    }

    var focusedOption = {};
    for(var i = 0; i < currentOptions.length; i++){
      if(currentOptions[i].optionIsSelected === false) {
        focusedOption = currentOptions[i];
        break;
      }
    }

    this.setState({
      options : currentOptions,
      focusedOption : focusedOption
    });
  },

  _handleSelectedOptionRemoved : function(option){
    var currentOptions = this.state.options;

    for(var i = 0; i < this.state.options.length; i++){
      if(this.state.options[i].name === option.name && this.state.options[i].value === option.value){
        currentOptions[i].optionIsSelected = false;
        break;
      }
    }

    for(var i = 0; i < this.state.options.length; i++){
      currentOptions[i].filteredOption = false;
    }

    var focusedOption = {};
    for(var i = 0; i < currentOptions.length; i++){
      if(currentOptions[i].optionIsSelected === false) {
        focusedOption = currentOptions[i];
        break;
      }
    }

    this.setState({
      options : currentOptions,
      typeAhead : "",
      focusedOption : focusedOption
    });

    this._removeOptionFromSelectedOptions(option);
  },

  _removeOptionFromSelectedOptions : function(option){
    var currentSelectedOptions = this.state.selectedOptions;

    for(var i = 0; i < currentSelectedOptions.length; i++){
      if(currentSelectedOptions[i].name === option.name && currentSelectedOptions[i].value === option.value){
        currentSelectedOptions.splice(i, 1);
        break;
      }
    }

    var showPlaceholder = false;
    if(currentSelectedOptions.length === 0){
      showPlaceholder = true;
    }

    this.setState({
      selectedOptions : currentSelectedOptions,
      placeholder : showPlaceholder
    }, function(){
      document.getElementById("type-ahead").focus();
    });
  }
});

module.exports = MultiSelect;