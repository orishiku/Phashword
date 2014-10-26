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
var { ToggleButton } = require('sdk/ui/button/toggle');

var popup = require("sdk/panel").Panel({
  contentURL: data.url("popup.html"),
  contentScriptFile: [
    data.url('jquery-2.1.1.min.js'),
    data.url('popup.js')
  ],
  contentStyleFile: data.url("css/style.css"),
  height: 280,
  width: 470,
  onHide: handleHide
});

var button = ToggleButton({
  id: "phashword",
  label: "Phashword",
  icon: {
    "16": "./img/icon-16.png",
    "32": "./img/icon-32.png",
    "64": "./img/icon-64.png"
  },
  onChange: handleChange
});

function handleChange(state) {
  if(state.checked) {
    popup.show({position: button});
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

exports.popup = popup;