import { OWHotkeys } from '@overwolf/overwolf-api-ts/dist';
import { hotkeys, newWorldId } from '../OverwolfWindows/consts';

export type HotkeyManagerWindow = typeof window & {
    NWMM_HotkeyManager: HotkeyManager;
}

type Hotkey = keyof typeof hotkeys;
type OnHotkeyInvokedListener = (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent) => void;

class HotkeyManager {
    private static _instance: HotkeyManager;
    private hotkeyListeners: Readonly<Record<Hotkey, Set<OnHotkeyInvokedListener>>>;
    private hotkeyTexts: Map<Hotkey, string>;

    constructor() {
        this.hotkeyListeners = {
            toggleInGame: new Set(),
            zoomIn: new Set(),
            zoomOut: new Set(),
        };
        this.hotkeyTexts = new Map();

        for (const [key, overwolfBindName] of Object.entries(hotkeys)) {
            const hotkeyKey = key as Hotkey;

            OWHotkeys.onHotkeyDown(overwolfBindName, (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent) => {
                this.hotkeyListeners[hotkeyKey].forEach(l => {
                    l(hotkeyResult);
                });
            });

            OWHotkeys.getHotkeyText(hotkeys.toggleInGame, newWorldId).then(hotkeyText => {
                this.hotkeyTexts.set(hotkeyKey, hotkeyText);
            });
        }
    }

    public static get isSupported() {
        return NWMM_APP_WINDOW === 'background';
    }

    public static get instance(): HotkeyManager {
        if (!this.isSupported) {
            throw new Error('Using HotkeyManager directly in this window is not supported. Use getHotkeyManager instead.');
        }

        if (!HotkeyManager._instance) {
            HotkeyManager._instance = new HotkeyManager();
        }

        return HotkeyManager._instance;
    }

    public registerHotkey = (hotkey: Hotkey, listener: OnHotkeyInvokedListener) => {
        this.hotkeyListeners[hotkey].add(listener);
        return () => {
            this.hotkeyListeners[hotkey].delete(listener);
        };
    }

    public getHotkeyText = (hotkey: Hotkey) => this.hotkeyTexts.get(hotkey);
}

export function initializeHotkeyManager() {
    if (HotkeyManager.isSupported) {
        (window as HotkeyManagerWindow).NWMM_HotkeyManager = HotkeyManager.instance;
    }
}

export function getHotkeyManager() {
    return (overwolf.windows.getMainWindow() as HotkeyManagerWindow).NWMM_HotkeyManager;
}
