var crypto = require("crypto");
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(global.config.keys.mandrill.secret);
var _ = require('lodash');

module.exports = {
  encryptPassword: function(password, salt){
    if (salt == null || salt == '') {
      salt = this.randomString(12);
    }
    var enc = crypto.createHmac('sha1', salt).update(password).digest('base64');
    return {password: enc, salt: salt};
  },

  randomString: function (length) {
    length = length ? length : 12;
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
    var string = '';

    for (var i = 0; i < length; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
  },

  sendMail: function(template, data, callback){
    var to = data.email;
    var data = _.chain(data).keys().map(function(k){
      return {
        name: k,
        content: data[k]
      }
    }).value();
    mandrill_client.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [{email: to}],
        global_merge_vars: data,
        merge: true
      }
    }, callback);
  }
};