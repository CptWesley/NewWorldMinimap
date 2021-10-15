declare const NWMM_APP_WINDOW: 'background' | 'desktop' | 'inGame';
declare const NWMM_APP_NAME: string;
declare const NWMM_APP_VERSION: string;
declare const NWMM_APP_BUILD_DATE: string;
declare const NWMM_APP_BUILD_OPK: boolean;

declare type Vector2 = {
    x: number;
    y: number;
};

declare type Vector3 = {
    x: number;
    y: number;
    z: number;
}

declare type Marker = {
    category: string;
    type: string;
    pos: Vector2;
    text: string;
}

declare type Tile = {
    image: ImageBitmap | null;
    markers: Promise<Marker[]>;
}

declare type IconTypeSetting = {
    name: string;
    value: boolean;
}

declare type IconCategorySetting = {
    name: string,
    value: boolean,
    types: Record<string, IconTypeSetting>,
}

declare type IconSettings = {
    categories: Record<string, IconCategorySetting>,
}

declare type PlayerData = {
    position: Vector3,
    rotation: Vector3,
    compass: string,
    map: string | undefined,
    name: string | undefined,
    world: string | undefined,
}
