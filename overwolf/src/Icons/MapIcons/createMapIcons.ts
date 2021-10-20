import { svgMapIconToImageBitmap } from '../../logic/svg';
import AlligatorIcon from './AlligatorIcon';
import ArcaneRepositoryIcon from './ArcaneRepositoryIcon';
import BearIcon from './BearIcon';
import CarrotIcon from './CarrotIcon';
import ChestIcon from './ChestIcon';
import CornIcon from './CornIcon';
import CovenantIcon from './CovenantIcon';
import DocumentIcon from './DocumentIcon';
import DropletIcon from './DropletIcon';
import DyeBottleIcon from './DyeBottleIcon';
import EssenceIcon from './EssenceIcon';
import EssenceMinusIcon from './EssenceMinusIcon';
import EssencePlusIcon from './EssencePlusIcon';
import FishIcon from './FishIcon';
import ForgeIcon from './ForgeIcon';
import FriendIcon from './FriendIcon';
import GoatIcon from './GoatIcon';
import GovernorDeskIcon from './GovernorDeskIcon';
import HempIcon from './HempIcon';
import InnIcon from './InnIcon';
import KitchenIcon from './KitchenIcon';
import LeopardIcon from './LeopardIcon';
import LoomIcon from './LoomIcon';
import MarauderIcon from './MarauderIcon';
import OreIcon from './OreIcon';
import OutfittingStationIcon from './OutfittingStationIcon';
import PigIcon from './PigIcon';
import PlantIcon from './PlantIcon';
import PlayerIcon from './PlayerIcon';
import PotatoIcon from './PotatoIcon';
import RabbitIcon from './RabbitIcon';
import SheepIcon from './SheepIcon';
import SkullIcon from './SkullIcon';
import SmelterIcon from './SmelterIcon';
import StonecuttingTableIcon from './StonecuttingTableIcon';
import StorageShedIcon from './StorageShedIcon';
import StrawberryIcon from './StrawberryIcon';
import SyndicateIcon from './SyndicateIcon';
import TanneryIcon from './TanneryIcon';
import TerritoryBoardIcon from './TerritoryBoardIcon';
import TownBoardIcon from './TownBoardIcon';
import TradingPostIcon from './TradingPostIcon';
import TreeIcon from './TreeIcon';
import TurkeyIcon from './TurkeyIcon';
import UnknownIcon from './UnknownIcon';
import WarBoardIcon from './WarBoardIcon';
import WolfIcon from './WolfIcon';
import WoodshopIcon from './WoodshopIcon';
import WorkshopIcon from './WorkshopIcon';

export type MapIcons = typeof createMapIcons extends (...args: any[]) => Promise<infer T> ? T : never;

export async function createMapIcons(scale: number) {
    return {
        player: await svgMapIconToImageBitmap(PlayerIcon, { fill: 'yellow', scale }),
        friend: await svgMapIconToImageBitmap(FriendIcon, { fill: 'blue', scale }),
        unknown: await svgMapIconToImageBitmap(UnknownIcon, { fill: 'red', scale }),

        ores: await svgMapIconToImageBitmap(OreIcon, { fill: 'green', scale }),
        crystal: await svgMapIconToImageBitmap(OreIcon, { fill: 'lightcyan', scale }),
        gold: await svgMapIconToImageBitmap(OreIcon, { fill: 'gold', scale }),
        iron: await svgMapIconToImageBitmap(OreIcon, { fill: 'saddlebrown', scale }),
        lodestone: await svgMapIconToImageBitmap(OreIcon, { fill: 'orangered', scale }),
        orichalcum: await svgMapIconToImageBitmap(OreIcon, { fill: 'darkred', scale }),
        platinium: await svgMapIconToImageBitmap(OreIcon, { fill: 'skyblue', scale }),
        saltpeter: await svgMapIconToImageBitmap(OreIcon, { fill: 'white', scale }),
        seeping_stone: await svgMapIconToImageBitmap(DropletIcon, { stroke: 'black', strokeWidth: 32, fill: 'darkgray', scale, viewBox: '0 0 512 512' }),
        silver: await svgMapIconToImageBitmap(OreIcon, { fill: 'silver', scale }),
        starmetal: await svgMapIconToImageBitmap(OreIcon, { fill: 'blue', scale }),

        woods: await svgMapIconToImageBitmap(TreeIcon, { fill: 'green', scale }),
        ironwood: await svgMapIconToImageBitmap(TreeIcon, { fill: 'gray', scale }),
        wyrdwood: await svgMapIconToImageBitmap(TreeIcon, { fill: 'darkblue', scale }),
        Briar: await svgMapIconToImageBitmap(TreeIcon, { fill: 'brown', scale }),

        fishing: await svgMapIconToImageBitmap(FishIcon, { fill: 'green', scale }),
        hotspot_broad: await svgMapIconToImageBitmap(FishIcon, { fill: 'blue', scale }),
        hotspot_rare: await svgMapIconToImageBitmap(FishIcon, { fill: 'yellow', scale }),
        hotspot_secret: await svgMapIconToImageBitmap(FishIcon, { fill: 'red', scale }),

        chests: await svgMapIconToImageBitmap(ChestIcon, { fill: 'saddlebrown', scale }),

        documents: await svgMapIconToImageBitmap(DocumentIcon, { fill: 'lightyellow', scale }),

        plants: await svgMapIconToImageBitmap(PlantIcon, { fill: 'lawngreen', scale }),
        azoth_water: await svgMapIconToImageBitmap(DropletIcon, { stroke: 'black', strokeWidth: 32, fill: 'aqua', scale, viewBox: '0 0 512 512' }),
        carrot: await svgMapIconToImageBitmap(CarrotIcon, { stroke: 'black', strokeWidth: 32, fill: 'orange', scale, viewBox: '0 0 512 512' }),
        corn: await svgMapIconToImageBitmap(CornIcon, { stroke: 'black', strokeWidth: 32, fill: 'yellow', scale, viewBox: '0 0 512 512' }),
        dye_plant_black: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'black', scale, viewBox: '0 0 512 512' }),
        dye_plant_blue: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'blue', scale, viewBox: '0 0 512 512' }),
        dye_plant_brown: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'brown', scale, viewBox: '0 0 512 512' }),
        dye_plant_cyan: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'cyan', scale, viewBox: '0 0 512 512' }),
        dye_plant_green: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'green', scale, viewBox: '0 0 512 512' }),
        dye_plant_magenta: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'magenta', scale, viewBox: '0 0 512 512' }),
        dye_plant_orange: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'orange', scale, viewBox: '0 0 512 512' }),
        dye_plant_red: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'red', scale, viewBox: '0 0 512 512' }),
        dye_plant_turquoise: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'turquoise', scale, viewBox: '0 0 512 512' }),
        dye_plant_violet: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'violet', scale, viewBox: '0 0 512 512' }),
        dye_plant_white: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'white', scale, viewBox: '0 0 512 512' }),
        dye_plant_yellow: await svgMapIconToImageBitmap(DyeBottleIcon, { stroke: 'black', strokeWidth: 32, fill: 'yellow', scale, viewBox: '0 0 512 512' }),
        hemp: await svgMapIconToImageBitmap(HempIcon, { stroke: 'black', strokeWidth: 32, fill: 'green', scale, viewBox: '0 0 512 512' }),
        hemp_t4: await svgMapIconToImageBitmap(HempIcon, { stroke: 'black', strokeWidth: 32, fill: 'blue', scale, viewBox: '0 0 512 512' }),
        hemp_t5: await svgMapIconToImageBitmap(HempIcon, { stroke: 'black', strokeWidth: 32, fill: 'red', scale, viewBox: '0 0 512 512' }),
        potato: await svgMapIconToImageBitmap(PotatoIcon, { stroke: 'black', strokeWidth: 32, fill: 'saddlebrown', scale, viewBox: '0 0 512 512' }),
        strawberries: await svgMapIconToImageBitmap(StrawberryIcon, { stroke: 'black', strokeWidth: 32, fill: 'red', scale, viewBox: '0 0 512 512' }),

        monsters: await svgMapIconToImageBitmap(SkullIcon, { fill: 'green', scale }),

        turkey: await svgMapIconToImageBitmap(TurkeyIcon, { fill: 'brown', scale }),
        turkey_nest: await svgMapIconToImageBitmap(TurkeyIcon, { fill: 'dodgerblue', scale }),

        wolf: await svgMapIconToImageBitmap(WolfIcon, { fill: 'lightgray', scale }),
        wolf_elemental: await svgMapIconToImageBitmap(WolfIcon, { fill: 'dodgerblue', scale }),

        elk: await svgMapIconToImageBitmap(WolfIcon, { fill: 'saddlebrown', scale }),
        elk_elemental: await svgMapIconToImageBitmap(WolfIcon, { fill: 'dodgerblue', scale }),

        named: await svgMapIconToImageBitmap(SkullIcon, { fill: 'red', scale }),

        alligator: await svgMapIconToImageBitmap(AlligatorIcon, { fill: 'olive', scale }),

        rabbit: await svgMapIconToImageBitmap(RabbitIcon, { fill: 'white', scale }),

        bear: await svgMapIconToImageBitmap(BearIcon, { fill: 'saddlebrown', scale }),
        bear_elemental: await svgMapIconToImageBitmap(WolfIcon, { fill: 'dodgerblue', scale }),

        pig: await svgMapIconToImageBitmap(PigIcon, { fill: 'lightpink', scale }),
        boar: await svgMapIconToImageBitmap(PigIcon, { fill: 'darkgray', scale }),

        cow: await svgMapIconToImageBitmap(PigIcon, { fill: 'whitesmoke', scale }),
        bison: await svgMapIconToImageBitmap(PigIcon, { fill: 'darkorange', scale }),

        goat: await svgMapIconToImageBitmap(GoatIcon, { fill: 'lightgray', scale }),

        sheep: await svgMapIconToImageBitmap(SheepIcon, { fill: 'whitesmoke', scale }),

        leopard: await svgMapIconToImageBitmap(LeopardIcon, { fill: 'darkorange', scale }),
        lion: await svgMapIconToImageBitmap(LeopardIcon, { fill: 'darkgoldenrod', scale }),
        lynx: await svgMapIconToImageBitmap(LeopardIcon, { fill: 'slategray', scale }),

        essences: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'green', scale }),

        air_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'whitesmoke', scale }),
        air_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'whitesmoke', scale }),
        air_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'whitesmoke', scale }),

        death_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'darkviolet', scale }),
        death_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'darkviolet', scale }),
        death_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'darkviolet', scale }),

        earth_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'saddlebrown', scale }),
        earth_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'saddlebrown', scale }),
        earth_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'saddlebrown', scale }),

        fire_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'orange', scale }),
        fire_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'orange', scale }),
        fire_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'orange', scale }),

        life_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'firebrick', scale }),
        life_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'firebrick', scale }),
        life_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'firebrick', scale }),

        soul_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'hotpink', scale }),
        soul_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'hotpink', scale }),
        soul_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'hotpink', scale }),

        water_boid: await svgMapIconToImageBitmap(EssenceIcon, { fill: 'dodgerblue', scale }),
        water_plant: await svgMapIconToImageBitmap(EssenceMinusIcon, { fill: 'dodgerblue', scale }),
        water_stone: await svgMapIconToImageBitmap(EssencePlusIcon, { fill: 'dodgerblue', scale }),

        loom: await svgMapIconToImageBitmap(LoomIcon, { fill: 'white', scale }),
        outfitting_station: await svgMapIconToImageBitmap(OutfittingStationIcon, { fill: 'white', scale }),
        smelter: await svgMapIconToImageBitmap(SmelterIcon, { fill: 'white', scale }),
        trading_post: await svgMapIconToImageBitmap(TradingPostIcon, { fill: 'white', scale }),
        woodshop: await svgMapIconToImageBitmap(WoodshopIcon, { fill: 'white', scale }),
        workshop: await svgMapIconToImageBitmap(WorkshopIcon, { fill: 'white', scale }),
        arcane_repository: await svgMapIconToImageBitmap(ArcaneRepositoryIcon, { fill: 'white', scale }),
        forge: await svgMapIconToImageBitmap(ForgeIcon, { fill: 'white', scale }),
        inn: await svgMapIconToImageBitmap(InnIcon, { fill: 'white', scale }),
        kitchen: await svgMapIconToImageBitmap(KitchenIcon, { fill: 'white', scale }),
        stonecutting_table: await svgMapIconToImageBitmap(StonecuttingTableIcon, { fill: 'white', scale }),
        storage_shed: await svgMapIconToImageBitmap(StorageShedIcon, { fill: 'white', scale }),
        tannery: await svgMapIconToImageBitmap(TanneryIcon, { fill: 'white', scale }),
        governors_desk: await svgMapIconToImageBitmap(GovernorDeskIcon, { fill: 'white', scale }),
        territory_planning_board: await svgMapIconToImageBitmap(TerritoryBoardIcon, { fill: 'white', scale }),
        town_project_board: await svgMapIconToImageBitmap(TownBoardIcon, { fill: 'white', scale }),
        war_board: await svgMapIconToImageBitmap(WarBoardIcon, { fill: 'white', scale }),
        syndicate_alchemist: await svgMapIconToImageBitmap(SyndicateIcon, { fill: 'purple', scale: scale / 5 }),
        covenant_adjudicator: await svgMapIconToImageBitmap(CovenantIcon, { fill: 'yellow', scale: scale / 5 }),
        marauder_commander: await svgMapIconToImageBitmap(MarauderIcon, { fill: 'green', scale: scale / 5 }),
    };
}
