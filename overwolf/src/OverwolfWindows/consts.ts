const newWorldId = 21816;

const interestingFeatures = [
    'location',
];

const windowNames = {
    inGame: 'in_game',
    desktop: 'desktop',
    background: 'background',
} as const;

export type BackgroundWindow = 'background';
export type ConcreteWindow = Exclude<keyof typeof windowNames, BackgroundWindow>;

const hotkeys = {
    toggleInGame: 'showhide',
} as const;

export {
    newWorldId,
    interestingFeatures,
    windowNames,
    hotkeys,
};
