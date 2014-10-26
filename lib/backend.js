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

var constants = require("./constants.js");
var ss = require("sdk/simple-storage");
var utils = require("./utils.js");

function createDefaultProfile(name="Default") {
  return {
    name: name,
    password_length: constants.DEFAULT_LENGTH,
    password_type: constants.PASSWORD_TYPES.SPECIAL,
    private_key: utils.generatePrivateKey(),
    hash_type: constants.MOZ_HASH_ALGORITHMS.SHA1,
    color: constants.DEFAULT_COLOR,
  };
}

function ProfileManager() {
  if (!ss.storage.profiles) {
    ss.storage.profiles = [createDefaultProfile()];
  }
  if (!ss.storage.site_settings) {
    ss.storage.site_settings = {};
  }
}

/**
 * Get profile from storage
 */
ProfileManager.prototype.getProfile = function(index) {
  return ss.storage.profiles[index];
};

/**
 * Get all profiles
 */
ProfileManager.prototype.getProfiles = function() {
  return ss.storage.profiles;
};

/**
 * Return a new profile
 */
ProfileManager.prototype.getNewProfile = function() {
  return createDefaultProfile("New Profile");
};

/**
 * Add profile to storage
 */
ProfileManager.prototype.addProfile = function(profile) {
  ss.storage.profiles.push(profile);
};

/**
 * Update stored profile
 */
ProfileManager.prototype.updateProfile = function(index, profile) {
  ss.storage.profiles[index] = profile;
};

/**
 * Remove profile from storage
 */
ProfileManager.prototype.removeProfile = function(index) {
  // Delete profile
  ss.storage.profiles.splice(index, 1);
  // Delete associated sites
  for (var site in ss.storage.site_settings) {
    if (ss.storage.site_settings[site] === index) {
      delete ss.storage.site_settings[site];
    }
  }
};

/**
 * Save site profile
 */
ProfileManager.prototype.setSiteSettings = function(site, profile) {
  ss.storage.site_settings[site] = profile;
};

/**
 * Load site profile
 */
ProfileManager.prototype.getSiteSettings = function(site) {
  var site_settings = {
    "profile_index": 0,
    "tag": site,
  };
  if (ss.storage.site_settings[site]) {
    site_settings = ss.storage.site_settings[site];
  }
  return site_settings;
};

exports.ProfileManager = ProfileManager;