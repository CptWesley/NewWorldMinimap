import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import Dexie from 'dexie';
import { getDynamicSettings } from './dynamicSettings';
import { generateRandomToken } from './util';

export type PlayerDataPlain = {
    name: string,
    location: Vector2,
};
type PlayerDataPsk = string;
type PlayerData = PlayerDataPlain | PlayerDataPsk;

type PlayerRequestDataPlain = {
    type: 'plain',
    data: PlayerDataPlain,
};
type PlayerRequestDataPsk = {
    type: 'psk',
    data: PlayerDataPsk,
};
type PlayerRequestData = PlayerRequestDataPlain | PlayerRequestDataPsk;

type PlayerRequest = PlayerRequestData & {
    id: string,
    friends: string[],
};

type PlayerResponseData = {
    id: string,
    data: PlayerData,
};

type PlayerResponse = {
    friends: PlayerResponseData[],
};

export type StoredFriend = {
    id: string,
    name: string,
    psk?: string,
}

export async function updateFriendLocation(server: string, id: string, name: string, location: Vector2, friends: string, psk: string): Promise<undefined | PlayerDataPlain[]> {
    let url = server.trim();

    if (!url || url.length === 0) {
        const settings = getDynamicSettings();
        if (settings && settings.friendServerEndpoint) {
            url = settings.friendServerEndpoint;
        }
    }

    if (!url || url.length === 0) { return undefined; }

    const friendList: string[] = [];
    const friendPsk = new Map<string, string>();
    for (const line of friends.split('\n')) {
        const parts = line.split(':');
        if (parts[0]) {
            friendList.push(parts[0]);
            if (parts[1]) {
                friendPsk.set(parts[0], parts[1]);
            }
        }
    }

    try {
        const data: PlayerDataPlain = {
            name,
            location,
        };
        let body: PlayerRequest;
        if (psk) {
            const encryptedData = AES.encrypt(JSON.stringify(data), psk).toString();
            body = {
                id,
                type: 'psk',
                data: encryptedData,
                friends: friendList,
            };
        } else {
            body = {
                id,
                type: 'plain',
                data,
                friends: friendList,
            };
        }

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
            // The server response looks valid
            return (response as PlayerResponse).friends.map<PlayerDataPlain | null>(f => {
                const { data, id } = f;
                if (typeof data === 'string' && friendPsk.has(id)) {
                    // It's encrypted data -- decrypt and validate it
                    try {
                        const decryptedData = AES.decrypt(data, friendPsk.get(id)!).toString(encUtf8);
                        if (!decryptedData) { return null; }
                        const deserialized = JSON.parse(decryptedData);
                        if (validatePlayerDataPlain(deserialized)) {
                            return deserialized;
                        }
                    } catch (err) { console.warn(err); }
                    return null;
                } else if (typeof data === 'object' && validatePlayerDataPlain(data)) {
                    // It's valid location data
                    return data;
                }
                return null;
            }).filter(f => f !== null) as PlayerDataPlain[];
        }
    } catch { }

    return undefined;
}

class FriendsDatabase extends Dexie {
    friends: Dexie.Table<StoredFriend, StoredFriend['id']>;

    constructor() {
        super('friends');
        this
            .version(1)
            .stores({
                // Store only the keys that should be indexed
                friends: '&id,name',
            });

        this.friends = this.table('friends');
    }
}

export async function getFriends() {
    const db = new FriendsDatabase();
    const friends = await db.friends.toArray();
    return friends;
}

export async function putFriend(friend: StoredFriend) {
    const db = new FriendsDatabase();
    await db.friends.put(friend, friend.id);
}

export async function updateFriend(key: StoredFriend['id'], changes: Partial<StoredFriend>) {
    const db = new FriendsDatabase();
    await db.friends.update(key, changes);
}

export async function deleteFriend(friend: StoredFriend) {
    const db = new FriendsDatabase();
    await db.friends.delete(friend.id);
}

function validatePlayerResponse(response: PlayerResponse): response is PlayerResponse {
    return typeof response === 'object'
        && Array.isArray(response.friends)
        && response.friends.every(r => {
            return typeof r === 'object'
                && typeof r.id === 'string';
        });
}

function validatePlayerDataPlain(data: PlayerDataPlain): data is PlayerDataPlain {
    return typeof data === 'object'
        && typeof data.name === 'string'
        && typeof data.location === 'object'
        && typeof data.location.x === 'number'
        && typeof data.location.y === 'number';
}

export function getFriendCode() {
    const code = localStorage.getItem('friendCode');
    return !code ? regenerateFriendCode() : code;
}

export function regenerateFriendCode() {
    const code = generateRandomToken();
    localStorage.setItem('friendCode', code);
    return code;
}
