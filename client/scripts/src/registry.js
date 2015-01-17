require([
  'knockout'
], function (ko) {
  'use strict';
  ko.components.register("dashboard", {require: "components/dashboard/dashboard"});
  ko.components.register("candidates", {require: "components/candidates/candidates"});
  ko.components.register("applications", {require: "components/applications/applications"});
  ko.components.register("applications-details", {require: "components/applications/applications-details"});
  ko.components.register("candidates-create", {require: "components/candidates/candidates-create"});
  ko.components.register("openings", {require: "components/openings/openings"});
  ko.components.register("openings-details", {require: "components/openings/openings-details"});
  ko.components.register("settings", {require: "components/settings/settings"});
  ko.components.register("nav-bar", {require: "components/nav-bar/nav-bar"});

});