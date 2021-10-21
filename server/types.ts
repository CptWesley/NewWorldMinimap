export type Vector2 = {
    x: number,
    y: number,
};

export type PlayerDataPlain = {
    name: string,
    location: Vector2,
};
export type PlayerDataPsk = string;
export type PlayerData = PlayerDataPlain | PlayerDataPsk;

export type PlayerDataDeprecated = {
    type: undefined,
    data: PlayerDataPlain,
};

export type PlayerRequestDataPlain = {
    type: 'plain',
    data: PlayerDataPlain,
};

export type PlayerRequestDataPsk = {
    type: 'psk',
    data: PlayerDataPsk,
};

export type PlayerRequestData = PlayerRequestDataPlain | PlayerRequestDataPsk | PlayerDataDeprecated;

export type PlayerId = {
    id: string,
};

export type FriendsList = {
    friends: string[],
};

export type PlayerRequest = PlayerRequestData & PlayerId & FriendsList;

export type PlayerResponseData = {
    id: string,
    data: PlayerData,
};

export type MapType = {
    data: PlayerData,
    timestamp: bigint,
}
export type MapTypeDeprecated = {
    data: PlayerDataPlain,
    timestamp: bigint,
}
