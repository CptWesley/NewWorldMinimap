declare const NWMM_APP_NAME: string;
declare const NWMM_APP_VERSION: string;
declare const NWMM_APP_BUILD_DATE: string;
declare const NWMM_APP_BUILD_OPK: boolean;

declare type Vector2 = {
    x: number;
    y: number;
};

declare type Marker = {
    category: string;
    type: string;
    pos: Vector2;
}

declare type Tile = {
    image: Promise<ImageBitmap>;
    markers: Promise<Marker[]>;
}

declare type IconSetting = {
    name: string;
    value: boolean;
}

declare type IconCategorySetting = {
    name: string;
    value: boolean;
    types: any;
}

declare type IconSettings = { categories: any; }

