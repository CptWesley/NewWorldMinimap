declare const NWMM_APP_WINDOW: 'background' | 'desktop' | 'inGame';
declare const NWMM_APP_NAME: string;
declare const NWMM_APP_VERSION: string;
declare const NWMM_APP_BUILD_DATE: string;
declare const NWMM_APP_BUILD_PRODUCTION: boolean;

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

declare type Tile = {
    image: ImageBitmap | null;
    markers: Marker[];
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

declare type GraphNode = {
    position: Vector2,
    neighbors: number[],
}

declare type NavigationGraph = {
    nodes: GraphNode[],
    markedForDeletion: Set<number>,
}
