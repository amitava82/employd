define(['knockout', 'moment', 'jquery', 'jquery.form', 'sortable'], function(ko, moment, $){
  ko.bindingHandlers.moment = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
      var val = valueAccessor();
      var date = moment(ko.utils.unwrapObservable(val));

      var format = allBindingsAccessor().format || 'MM/DD/YYYY';

      element.innerText = date.format(format);
    }
  };

  ko.bindingHandlers.jqform = {
    init: function(elem, valueAccessor, allBindingsAccessor, viewModel){
      $elem = $(elem);
      var val = valueAccessor();
      var onSubmit = val.onSubmit;
      $elem.ajaxForm({
        success: function (resp) {
          onSubmit(null, resp);
        },
        error: function (err) {
          onSubmit(err.responseJSON);
        }
      })
    },

    update: function(elem, valueAccessor, allBindingsAccessor, viewModel){

    }
  }

  ko.bindingHandlers.sortable = {
    init: function (elem, valueAccessor, allBindingAccessor, viewModel) {
      $(elem).sortable({
        items: ':not(.nosort)'
      });
      $(elem).bind('sortupdate', function(e, ui) {
        var idx = ui.item.index();
        var oldIdx = ui.oldindex;
        var val = valueAccessor();
        var collection = ko.utils.unwrapObservable(val.model);
        console.log(collection);
        var targetItem = collection[oldIdx];
        var swapItem = collection[idx];
        collection[idx] = targetItem;
        collection[oldIdx] = swapItem;
      });
    },

    update: function (elem, valueAccessor, allBindingAccessor, viewModel) {

      setTimeout(function () {
        $(elem).sortable('reload');
      }, 50)



    }
  }

});