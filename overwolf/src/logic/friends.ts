import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import SHA256 from 'crypto-js/sha256';
import Dexie from 'dexie';
import { v4 as uuidV4, validate as validateUuid } from 'uuid';
import { getDynamicSettings } from './dynamicSettings';

export const maxChannels = 10;
const friendIdKey = 'friendId';
const deprecatedFriendCodeKey = 'friendCode';
const deprecatedFriendPskKey = 'friendsPsk';
export function createNewChannel(): StoredChannel {
    return {
        color: '#ffffff',
        id: uuidV4(),
        label: '',
        psk: SHA256(uuidV4()).toString(),
    };
}
export function createEmptyChannel(): StoredChannel {
    return {
        color: '#ffffff',
        id: '',
        label: '',
        psk: '',
    };
}

localStorage.removeItem(deprecatedFriendCodeKey);
localStorage.removeItem(deprecatedFriendPskKey);

export type FriendData = {
    name: string,
    location: Vector2,
    colors: string[],
}

type PlainTextPlayerData = {
    /** The player's name. */
    n: string,
    /** The player's location. */
    l: Vector2,
}

type PlayerDataPsk = {
    type: 'psk',
    /** The ciphertext. */
    c: string,
};
type TransportPlayerData = PlayerDataPsk;

type PlayerChannelRequestData = {
    channel: string,
    data: TransportPlayerData,
};

type PlayerRequest = {
    id: string,
    channels: PlayerChannelRequestData[],
}

type PlayerChannelResponseData = {
    channel: string,
    data: TransportPlayerData[],
};

type PlayerResponse = {
    channels: PlayerChannelResponseData[];
}

export type StoredChannel = {
    id: string,
    psk: string,
    label: string,
    color: string,
}

export async function updateFriendLocation(server: string, name: string, location: Vector2): Promise<undefined | FriendData[]> {
    let url = server.trim();

    if (!url || url.length === 0) {
        const settings = getDynamicSettings();
        if (settings && settings.friendServerEndpoint) {
            url = settings.friendServerEndpoint;
        }
    }

    if (!url || url.length === 0) { return undefined; }

    const id = getFriendId();
    const channels = await getChannels();

    try {
        const data: PlainTextPlayerData = {
            n: name,
            l: location,
        };
        const body: PlayerRequest = {
            id,
            channels: channels.map<PlayerChannelRequestData>(c => ({
                channel: c.id,
                data: {
                    type: 'psk',
                    c: AES.encrypt(JSON.stringify(data), c.psk).toString(),
                },
            })),
        };

        const req = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const response = await req.json();
        if (validatePlayerResponse(response as PlayerResponse)) {
            const friendData: FriendData[] = [];
            function addFriend(player: PlainTextPlayerData, channel: StoredChannel) {
                let friend = friendData.find(fd => fd.name === player.n);
                if (!friend) {
                    friend = { colors: [], location: { x: player.l.x, y: player.l.y }, name: player.n };
                    friendData.push(friend);
                }
                friend.colors.push(channel.color);
            }

            for (const channelDatum of (response as PlayerResponse).channels) {
                const originalChannel = channels.find(c => c.id === channelDatum.channel);
                if (!originalChannel) { continue; }
                for (const playerData of channelDatum.data) {
                    if (playerData.type === 'psk') {
                        try {
                            const decryptedData = AES.decrypt(playerData.c, originalChannel.psk).toString(encUtf8);
                            if (!decryptedData) { continue; }
                            const deserialized = JSON.parse(decryptedData);
                            if (validatePlayerDataPlain(deserialized)) {
                                addFriend(deserialized, originalChannel);
                            }
                        } catch {
                            // Just don't add
                        }
                    }
                }
            }

            return friendData;
        }
    } catch { }

    return undefined;
}

class ChannelsDatabase extends Dexie {
    channels: Dexie.Table<StoredChannel, StoredChannel['id']>;

    constructor() {
        super('channels');
        this
            .version(3)
            .stores({
                // Store only the keys that should be indexed
                channels: '&id',
            });

        this.channels = this.table('channels');
    }
}

export async function getChannels() {
    const db = new ChannelsDatabase();
    const friends = await db.channels.toArray();
    friends.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
    return friends;
}

export async function putChannel(channel: StoredChannel) {
    const db = new ChannelsDatabase();
    await db.channels.put(channel, channel.id);
}

export async function updateChannel(key: StoredChannel['id'], changes: Partial<StoredChannel>) {
    const db = new ChannelsDatabase();
    await db.channels.update(key, changes);
}

export async function deleteChannel(friend: StoredChannel) {
    const db = new ChannelsDatabase();
    await db.channels.delete(friend.id);
}

function validatePlayerResponse(response: PlayerResponse): response is PlayerResponse {
    return !!response
        && typeof response === 'object'
        && Array.isArray(response.channels)
        && response.channels.every(c => validateChannelData(c));
}

function validateChannelData(channelData: PlayerChannelResponseData): channelData is PlayerChannelResponseData {
    return !!channelData
        && typeof channelData === 'object'
        && typeof channelData.channel === 'string'
        && validateUuid(channelData.channel)
        && Array.isArray(channelData.data)
        && channelData.data.every(cd => validatePlayerData(cd));
}

function validatePlayerData(data: TransportPlayerData): data is TransportPlayerData {
    return !!data
        && typeof data === 'object'
        && data.type === 'psk'
        && typeof data.c === 'string';
}

function validatePlayerDataPlain(data: PlainTextPlayerData): data is PlainTextPlayerData {
    return typeof data === 'object'
        && typeof data.n === 'string'
        && typeof data.l === 'object'
        && typeof data.l.x === 'number'
        && typeof data.l.y === 'number';
}

export function getFriendId() {
    const code = localStorage.getItem(friendIdKey);
    return code || regenerateFriendId();
}

export function regenerateFriendId() {
    const code = uuidV4();
    localStorage.setItem('friendId', code);
    return code;
}
