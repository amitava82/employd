define(['knockout', 'moment'], function(ko, moment){
  ko.bindingHandlers.moment = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var val = valueAccessor();
      var date = moment(ko.utils.unwrapObservable(val));

      var format = allBindingsAccessor().format || 'MM/DD/YYYY';

      element.innerText = date.format(format);
    }
  };
});