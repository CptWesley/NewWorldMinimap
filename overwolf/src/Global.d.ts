declare const NWMM_APP_WINDOW: 'background' | 'desktop' | 'inGame';
declare const NWMM_APP_NAME: string;
declare const NWMM_APP_VERSION: string;
declare const NWMM_APP_BUILD_DATE: string;
declare const NWMM_APP_BUILD_PRODUCTION: boolean;

declare type TileLevel = 2 | 3 | 4 | 5 | 6 | 7 | 8;
declare type TileScale = 1 | 2 | 4 | 8 | 16 | 32 | 64;

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
    name?: string | undefined;
    pos: Vector2;
}

declare type MapRenderData = {
    tiles: (ImageBitmap | null)[][];
    markers: Marker[];
    tileScale: TileScale;
}

declare type IconTypeSetting = {
    category: string;
    type: string;
    visible: boolean;
    showLabel: boolean;
}

declare type IconCategorySetting = {
    category: string,
    visible: boolean,
    showLabel: boolean,
    types: Record<string, IconTypeSetting>,
}

type IconProperty = Extract<keyof (IconCategorySetting | IconTypeSetting), 'visible' | 'showLabel'>;

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

declare type FriendData = {
    name: string,
    location: Vector2,
}

type AnimationInterpolation =
    | 'none'
    | 'cosine'
    | 'linear'
    ;

declare type GraphNode = {
    position: Vector2,
    neighbors: number[],
}
