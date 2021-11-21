import { OWHotkeys } from '@overwolf/overwolf-api-ts/dist';
import { hotkeys, newWorldId } from '../OverwolfWindows/consts';
import AppPlatform from './platform';
import UnloadingEvent from './unloadingEvent';

type Hotkey = keyof typeof hotkeys;
type OnHotkeyInvokedListener = (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent) => void;

class HotkeyManager {
    private static _instance: HotkeyManager;
    private hotkeyEvents: Readonly<Record<Hotkey, UnloadingEvent<OnHotkeyInvokedListener>>>;
    private hotkeyTexts: Map<Hotkey, string>;

    constructor() {
        this.hotkeyEvents = {
            toggleInGame: new UnloadingEvent('toggleInGame'),
            zoomIn: new UnloadingEvent('zoomIn'),
            zoomOut: new UnloadingEvent('zoomOut'),
        };
        this.hotkeyTexts = new Map();

        if (AppPlatform.isOverwolfApp()) {
            for (const [key, overwolfBindName] of Object.entries(hotkeys)) {
                const hotkeyKey = key as Hotkey;

                OWHotkeys.onHotkeyDown(overwolfBindName, (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent) => {
                    this.hotkeyEvents[hotkeyKey].fire(hotkeyResult);
                });

                OWHotkeys.getHotkeyText(hotkeys.toggleInGame, newWorldId).then(hotkeyText => {
                    this.hotkeyTexts.set(hotkeyKey, hotkeyText);
                });
            }
        }
    }

    public static get instance(): HotkeyManager {
        if (!HotkeyManager._instance) {
            HotkeyManager._instance = new HotkeyManager();
        }

        return HotkeyManager._instance;
    }

    public registerHotkey = (hotkey: Hotkey, listener: OnHotkeyInvokedListener, listenerWindow: Window) => {
        return this.hotkeyEvents[hotkey].register(listener, listenerWindow);
    }

    public getHotkeyText = (hotkey: Hotkey) => this.hotkeyTexts.get(hotkey);
}

export function initializeHotkeyManager() {
    return HotkeyManager.instance;
}
