/*
 * Copyright 2014 Greizgh
 *
 * This file is part of Phashword.
 *
 * Foobar is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Foobar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var utils = require("./utils.js");
var pwh = require("./PasswordHasher.js");
var backend = require("./backend.js");

var popup = require("./popup.js").popup;

var passwordHasher = new pwh.PasswordHasher();

var manager = new backend.ProfileManager();

var settingsWorker;

/********** Content script **********/

var workers = [];

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

var selector = pageMod.PageMod({
  include: ['*'],
  contentScriptWhen: 'ready',
  contentScriptFile: [
    data.url('jquery-2.1.1.min.js'),
    data.url('content.js')],
    onAttach: function(worker) {
      workers.push(worker);
      worker.port.on("ready", function() {
        var profile = manager.getProfile(manager.getSiteSettings(utils.grepUrl(worker.tab.url)).profile_index);
        worker.port.emit("update_profile", profile);
      });
      worker.port.on("get_hash", function(key) {
        var site_profile = manager.getSiteSettings(utils.grepUrl(worker.tab.url));
        var profile = manager.getProfile(site_profile.profile_index);
        var hash = passwordHasher.hashPassword(
          site_profile.tag,
          key,
          profile.private_key,
          profile.password_length,
          profile.password_type
        );
        worker.port.emit("hash", hash);
      });
      worker.on('detach', function() {
        detachWorker(this, workers);
      });
    }
});
/********** End content script **********/

/* Update current URL */
tabs.on('activate', function(tab) {
  currentUrl = tab.url;
  updatePopup();
});
tabs.on('ready', function(tab) {
  currentUrl = tabs.activeTab.url;
  updatePopup();
});

function updateWorkers() {
  workers.forEach(function(worker) {
    var profile = manager.getProfile(manager.getSiteSettings(utils.grepUrl(worker.tab.url)).profile_index);
    worker.port.emit("update_profile", profile);

  });
}

function updatePopup() {
  var site_settings = manager.getSiteSettings(utils.grepUrl(currentUrl));
  popup.port.emit("update_settings", site_settings);
}

/* Popup events */
popup.port.on("ready", function() {
  var profiles = manager.getProfiles();
  popup.port.emit("populate", profiles);
});
popup.port.on("update_profile", function(data) {
  manager.updateProfile(data.profile_index, data.profile);
  if (settingsWorker) {
    var profiles = manager.getProfiles();
    settingsWorker.port.emit("populate", profiles);
  }
  updateWorkers();
});
popup.port.on("select_profile", function(profile_index) {
  var site_settings = manager.getSiteSettings(utils.grepUrl(currentUrl));
  site_settings.profile_index = profile_index;
  manager.setSiteSettings(utils.grepUrl(currentUrl), site_settings);
  updateWorkers();
});
popup.port.on("update_tag", function(tag) {
  var site_settings = manager.getSiteSettings(utils.grepUrl(currentUrl));
  site_settings.tag = tag;
  manager.setSiteSettings(utils.grepUrl(currentUrl), site_settings);
});

popup.port.on("display_settings", function() {
  tabs.open({
    url: data.url("settings.html"),
    inBackground: false,
    onReady: function(tab)
    {
      worker = tab.attach({
        contentScriptFile: [
          data.url("jquery-2.1.1.min.js"),
          data.url("settings.js"),
        ]
      });
      settingsWorker = worker;
      // Settings panel events
      worker.port.on("ready", function() {
        var profiles = manager.getProfiles();
        worker.port.emit("populate", profiles);
      });
      worker.port.on("add_profile", function() {
        manager.addProfile(manager.getNewProfile());
        worker.port.emit("populate", manager.getProfiles());
        popup.port.emit("populate", manager.getProfiles());
      });
      worker.port.on("remove_profile", function(index) {
        manager.removeProfile(index);
        worker.port.emit("populate", manager.getProfiles());
        popup.port.emit("populate", manager.getProfiles());
      });
      worker.port.on("update_profile", function(data) {
        manager.updateProfile(data.profile_index, data.profile);
        popup.port.emit("populate", manager.getProfiles());
        updateWorkers();
      });
      worker.on("detach", function() {
        settingsWorker = undefined;
      });
    }
  });
});