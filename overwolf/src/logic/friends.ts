import { getDynamicSettings } from './dynamicSettings';
import { generateRandomToken } from './util';

export async function updateFriendLocation(id: string, name: string, location: Vector2, friends: string) {
    const settings = getDynamicSettings();
    if (settings && settings.friendServerEndpoint) {
        try {
            const req = await fetch(settings.friendServerEndpoint, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    data: {
                        name,
                        location: { x: location.x, y: location.y },
                    },
                    friends: friends.split('\n'),
                }),
            });
            return await req.json();
        } catch (_) { }
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
