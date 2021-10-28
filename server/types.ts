export type Vector2 = {
    x: number,
    y: number,
};

export type PlayerDataPsk = {
    type: 'psk',
    /** The ciphertext. */
    c: string,
};
export type PlayerData = PlayerDataPsk;

export type PlayerChannelRequestData = {
    channel: string,
    data: PlayerData,
};

export type PlayerRequest = {
    id: string,
    channels: PlayerChannelRequestData[],
}

export type MapType = {
    data: PlayerData,
    timestamp: bigint,
};

export type PlayerChannelResponseData = {
    channel: string,
    data: PlayerData[],
};

export type PlayerResponse = {
    channels: PlayerChannelResponseData[];
}

export type DeprecatedPlayerData = {
    name: string,
    location: Vector2,
};

export type DeprecatedPlayerRequest = {
    id: string,
    data: DeprecatedPlayerData,
    friends: string[],
};

export type DeprecatedMapType = {
    data: DeprecatedPlayerData,
    timestamp: bigint,
}

export type DeprecatedPlayerResponse = {
    id: string,
    data: DeprecatedPlayerData,
};
