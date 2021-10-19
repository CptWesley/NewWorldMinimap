import { generateRandomToken } from './util';

const serverUrl = process.env.SERVER_URL || 'http://localhost:8000/data/update';

export async function updateFriendLocation(id: string, name: string, location: Vector2, friends: string) {
    if (process.env.ENABLE_FRIENDS === 'true') {
        try {
            const req = await fetch(serverUrl, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    data: {
                        name,
                        location: { x: location.x, y: location.y},
                    },
                    friends: friends.split('\n'),
                }),
            });
            return await req.json();
        } catch (_) {}
    }
    return undefined;
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
