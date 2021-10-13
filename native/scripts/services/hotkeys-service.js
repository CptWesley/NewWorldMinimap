define(['../constants/hotkeys-ids.js'], function (HOTKEYS) {

	// List of Toggle hotkeys that we're listening for
	const toggle_hotkeys = {};

	// List of Hold hotkeys that we're listening for
	const hold_hotkeys = {};

	/**
	 * Listen to any Toggle hotkey press, and execute any stored custom action
	 */
	overwolf.settings.hotkeys.onPressed.addListener(function(e){
		if(e.name in toggle_hotkeys) toggle_hotkeys[e.name]();
	});


	/**
	 * Listen to any Hold hotkey press, and execute any stored custom action
	 */
	overwolf.settings.hotkeys.onHold.addListener(function(e){
		if(e.name in hold_hotkeys) hold_hotkeys[e.name](e.state);
	});


	/**
	 * get a hotkey combination by hotkey id
	 * @param hotkeyId
	 * @param callback
	 * @private
	 */
	function _getHotkey(hotkeyId, callback) {
		overwolf.settings.hotkeys.get(function (data) {
			if (!data || data.success !== true) {
				setTimeout(function () {
					_getHotkeyNew(hotkeyId, callback);
				}, 2000);
			} else {

				var result = false;
				var game_id = '21216'; // SET THIS TO YOUR OWN GAME'S ID!

				if('games' in data && game_id in data.games) {

					data.games[game_id].forEach(function(hk){
						if(hk.name == hotkeyId) {

							result = '';
							result += _translateModifierKeys(hk.modifierKeys);
							result += _translateVirtualKeycode(hk.virtualKeycode);

						}
					});

				}

				callback(result);
			}
		});
	}

	/**
	 * set custom action for a hotkey id (not of HOLD type)
	 * @param hotkeyId
	 * @param action
	 * @private
	 */
	function _setHotkey(hotkeyId, action) {
		toggle_hotkeys[hotkeyId] = action;
	}

	/**
	 * set custom action for a HOLD hotkey id
	 * @param hotkeyId
	 * @param action
	 * @private
	 */
	function _setHoldHotkey(hotkeyId, action) {
		hold_hotkeys[hotkeyId] = action;
	}

	function getToggleHotkey() {
		return new Promise((resolve, reject) => {
			_getHotkey(HOTKEYS.TOGGLE, function (result) {
				resolve(result);
			});
		});
	}

	function setToggleHotkey(action) {
		_setHotkey(HOTKEYS.TOGGLE,action);
	}

	function addHotkeyChangeListener(listener) {
		overwolf.settings.hotkeys.onChanged.addListener(listener);
	}


	/**
	 * translate MS ModifierKeys Enum to human-readable name
	 * @param modifierKeysEnum
	 * @private
	 */
	function _translateModifierKeys(modifierKeysEnum){
		var k = modifierKeysEnum;
		var result = '';

		var alt = k % 2 > 0;
		if(alt) {
			result += 'Alt+';
			k -= 1;
		}
		var ctrl = k % 4 > 1;
		if(ctrl) {
			result += 'Ctrl+';
			k -= 1;
		}
		var shift = k % 8 > 3;
		if(shift) {
			result += 'Shift+';
			k -= 1;
		}
		var windows = k % 16 > 7;
		if(windows) {
			result += 'Windows+';
		}

		return result;
	}

	/**
	 * translate MS VirtualKey Enum to human-readable name
	 * @param virtualKeyEnum
	 * @private
	 */
	function _translateVirtualKeycode(virtualKeyEnum){
		var result = 'unknown';
		var enums = {"8":"BACKSPACE","9":"TAB","13":"ENTER","16":"SHIFT","17":"CTRL","18":"ALT","19":"PAUSE","20":"CAPS_LOCK","27":"ESC","32":"SPACE","33":"PAGE_UP","34":"PAGE_DOWN","35":"END","36":"HOME","37":"LEFT","38":"UP","39":"RIGHT","40":"DOWN","45":"INSERT","46":"DELETE","48":"0","49":"1","50":"2","51":"3","52":"4","53":"5","54":"6","55":"7","56":"8","57":"9","65":"A","66":"B","67":"C","68":"D","69":"E","70":"F","71":"G","72":"H","73":"I","74":"J","75":"K","76":"L","77":"M","78":"N","79":"O","80":"P","81":"Q","82":"R","83":"S","84":"T","85":"U","86":"V","87":"W","88":"X","89":"Y","90":"Z","91":"LEFT_META","92":"RIGHT_META","93":"SELECT","96":"NUMPAD_0","97":"NUMPAD_1","98":"NUMPAD_2","99":"NUMPAD_3","100":"NUMPAD_4","101":"NUMPAD_5","102":"NUMPAD_6","103":"NUMPAD_7","104":"NUMPAD_8","105":"NUMPAD_9","106":"Numpad *","107":"Numpad +","109":"Numpad -","110":"Numpad .","111":"Numpad /","112":"F1","113":"F2","114":"F3","115":"F4","116":"F5","117":"F6","118":"F7","119":"F8","120":"F9","121":"F10","122":"F11","123":"F12","144":"NUM_LOCK","145":"SCROLL_LOCK","186":";","187":"=","188":",","189":"-","190":".","191":"/","192":"`","219":"[","220":"\\","221":"]","222":"'"};
		var key_name = enums[virtualKeyEnum];

		// Capitalize first letter only
		if(key_name) result = key_name.charAt(0).toUpperCase() + key_name.toLowerCase().slice(1);

		return result;
	}

	return {
		getToggleHotkey,
		setToggleHotkey,
		addHotkeyChangeListener
	};
});
