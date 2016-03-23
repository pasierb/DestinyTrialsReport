// Destiny Inventory Bucket Definition

var BUCKET_HEAD = 3448274439;
var BUCKET_CHEST = 14239492;
var BUCKET_ARMS = 3551918588;
var BUCKET_LEGS = 20886954;
var BUCKET_ARTIFACT = 434908299;
var BUCKET_GHOST = 4023194814;
var BUCKET_CLASS_ITEM = 1585787867;

var BUCKET_PRIMARY_WEAPON = 1498876634;
var BUCKET_SPECIAL_WEAPON = 2465295065;
var BUCKET_HEAVY_WEAPON = 953998645;

var BUCKET_BUILD = 3284755031;


// Destiny Stat Definition

var STAT_INTELLECT = 144602215;
var STAT_DISCIPLINE = 1735777505;
var STAT_STRENGTH = 4244567218;
var STAT_LIGHT = 2391494160;
var STAT_BASE_DAMAGE = 4043523819;

var statNames = {
  STAT_INTELLECT: 'Intellect',
  STAT_DISCIPLINE: 'Discipline',
  STAT_STRENGTH: 'Strength',
  STAT_ARMOR: 'Armor',
  STAT_AGILITY: 'Agility',
  STAT_RECOVERY: 'Recovery'
};

var statNamesByHash = {
   392767087: 'Armor',
  2996146975: 'Agility',
  1943323491: 'Recovery'
};

var burns = ['Void Damage', 'Arc Damage', 'Solar Damage'];

// Grenade defs
var FIREBOLT_GRENADE = 2927723086;
var FUSION_GRENADE = 2995804739;
var VOIDWALL_GRENADE = 2576774201;
var STORM_GRENADE = 3347197644;
var VORTEX_GRENADE = 2008044721;
var ARCBOLT_GRENADE = 3078181438;
var SCATTER_GRENADE = 3252353493;
var SOLAR_GRENADE = 1397213608;
var TRIPMINE_GRENADE = 455260043;
var AXION_GRENADE = 243660113;
var SKIP_GRENADE = 328872098;


// Subclass Definitions
var SUNSINGER_CLASS = 3658182170;
var VOIDWALKER_CLASS = 3828867689;
var BLADEDANCER_CLASS = 2962927168;
var SUNBREAKER_CLASS = 21395672;     // or 21395673
var NIGHTSTALKER_CLASS = 4143670657; // or 4143670656
var STORMCALLER_CLASS = 1256644900;  // or 1256644901
var GUNSLINGER_CLASS = 1716862031;
var STRIKER_CLASS = 2455559914;
var DEFENDER_CLASS = 2007186000;


// Hazards

hazardMiscArmorPerks = {
  2682002320: 'Faster Revive',    // Crest of Alpha Lupi (Titan) Year 1
  1190369844: 'Faster Revive',    // Crest of Alpha Lupi (Titan) Year 2 (or 1190369845)
  3821972036: 'Faster Revive',    // Crest of Alpha Lupi (Hunter) Year 1
  1760211262: 'Faster Revive',    // Crest of Alpha Lupi (Hunter) Year 2 (or 1760211263)
    40760096: 'Faster Revive',    // Light Beyond Nemesis Year 1
  1509404812: 'Faster Revive',    // Light Beyond Nemesis Year 2 (or 1509404813)
  2289894117: 'Grenade on Spawn', // Lucky Raspberry Year 1
  2819174431: 'Grenade on Spawn', // Lucky Raspberry Year 2
  2671461052: 'Grenade on Spawn', // Voidfang Vestments Year 1
  1351885744: 'Grenade on Spawn', // Voidfang Vestments Year 2
  2978872641: 'Double Grenade',   // The Armamentarium Year 1
  3911579221: 'Double Grenade',   // The Armamentarium Year 2
  2908652391: 'Melee on Spawn',   // An Insurmountable Skullfort Year 1
  2340078883: 'Double Melee',     // An Insurmountable Skullfort Year 2 (also Melee on Spawn)
  2783259970: 'Double Melee',     // Thagomizers Year 2
  1318675793: 'Double Melee',     // Sealed Ahamkara Grasps Year 2
  3406171126: 'Double Melee',     // Claws of Ahamkara Year 1
   405554470: 'Double Melee',     // Claws of Ahamkara Year 2
};

hazardMiscWeaponPerks = [
    77746637, // Relentless Tracker
   315800403, // Rewind Again
   431159510, // Third Eye
   661681055, // Headseeker
   770631416, // Third Eye
  1026458383, // Life Support
  1279198574, // Overflow
  1485291076, // Hat Trick
  1568304667, // Luck in the Chamber
  1843659180, // The Master
  2047535886, // Close and/or Personal
  2417835318, // Red Death
  2566491829, // Marksman
  2758635242, // Self Spotter
  3031234337, // Guerilla Fighter
  3369212512, // Blinding Light
  3464328064, // Surrounded
  3505787429, // Target Mark
  3695773985, // Patience and Time
  3752206822, // Final Round
  3911170550, // Firefly
  3921735041, // Final Round
  4271995221  // The Master
];

var hazardDoubleGrenadeByPerk = {
   280851997: SCATTER_GRENADE,  // Nothing Manacles Year 1
  4109126941: SCATTER_GRENADE,  // Nothing Manacles Year 2
  3471016318: FUSION_GRENADE,   // Starfire Protocol Year 1
   469911339: FUSION_GRENADE,   // Starfire Protocol Year 2
  3544054727: SOLAR_GRENADE,    // Sunbreakers Year 2
  1170991030: TRIPMINE_GRENADE, // Young Ahamkara's Spine Year 2
  1617397024: SKIP_GRENADE      // Shinobu's Vow Year 2
};

var hazardBurnDefense = {
  1723656171: 'Solar Resist',
  2095340230: 'Void Resist',
   539512168: 'Arc Resist'
};

var hazardGrantsAbilty = {
   136095187: 'Explosive Pyre',                  // Immolation Fists Year 2
   138051548: 'Death from Above and Headstrong', // Helm of Inmost Light Year 1
  1195575848: 'Death from Above and Headstrong', // Helm of Inmost Light Year 2
   285151207: 'Unstoppable',                     // Eternal Warrior Year 1
   836092325: 'Unstoppable',                     // Eternal Warrior Year 2
   896109025: 'Shadestep',                       // Graviton Forfeit Year 2
  1506633456: 'Landfall'                         // The Impossible Machines Year 2
};

var hazardGrantsAbiltySubclass = {};
hazardGrantsAbiltySubclass[STRIKER_CLASS] = [138051548, 1195575848, 285151207, 836092325];
hazardGrantsAbiltySubclass[SUNBREAKER_CLASS] = [136095187];
hazardGrantsAbiltySubclass[NIGHTSTALKER_CLASS] = [896109025];
hazardGrantsAbiltySubclass[STORMCALLER_CLASS] = [1506633456];

var hazardIncreasedArmor = {
  3944665868: [BLADEDANCER_CLASS, STORMCALLER_CLASS, STRIKER_CLASS],
   671224739: [SUNSINGER_CLASS, SUNBREAKER_CLASS, GUNSLINGER_CLASS],
  1028572792: [VOIDWALKER_CLASS, NIGHTSTALKER_CLASS, DEFENDER_CLASS]
};

var RELOAD_PRIMARY = 1844502900;
var RELOAD_SPECIAL = 765056859;
var RELOAD_HEAVY = 1094584227;

var RELOAD_SCOUT = 2129333927;
var RELOAD_PULSE = 177663318;
var RELOAD_AUTO = 3187783240;
var RELOAD_HAND_CANNON = 3241361759;

var RELOAD_SHOTGUN = 4090945472;
var RELOAD_SNIPER = 4111868508;
var RELOAD_FUSION = 1359068529;

var RELOAD_MACHINE = 836377941;
var RELOAD_LAUNCHER = 1938590973;

var itemPerkToBucket = {
  1844502900: 'primary',
   765056859: 'special',
  1094584227: 'heavy'
};

var bucketHashToName = {
  1498876634: 'primary',
  2465295065: 'special',
  953998645: 'heavy'
};

var reloadPerksToItemType = {
  2129333927: 14,
  1394084296: 14,
   177663318: 13,
  2482846307: 13,
  3187783240:  6,
  3031176193:  6,
  1175838572:  9,
  3241361759:  9,
  4090945472:  7,
  4111868508: 12,
  1359068529: 11,
  3689182788: 17,
   836377941:  8,
  1938590973: 10
};

var itemTypeToBucket = {
   6: 'primary',
   9: 'primary',
  13: 'primary',
  14: 'primary',
   7: 'special',
  11: 'special',
  12: 'special',
  17: 'special',
   8: 'heavy',
  10: 'heavy'
};

var itemTypeNameToBucket = {
  'Auto Rifle': 1498876634,
  'Hand Cannon': 1498876634,
  'Pulse Rifle': 1498876634,
  'Scout Rifle': 1498876634,
  'Fusion Rifle': 2465295065,
  'Sniper Rifle': 2465295065,
  'Shotgun': 2465295065,
  'Sidearm': 2465295065,
  'Machine Gun': 953998645,
  'Rocket Launcher': 953998645,
  'Sword': 953998645
};

var className = [
  'Titan',
  'Hunter',
  'Warlock'
];

// Match summary weapon kill definitions
var weaponKills = {
  weaponKillsHandCannon: 'Hand Cannon',
  weaponKillsPulseRifle: 'Pulse Rifle',
  weaponKillsScoutRifle: 'Scout Rifle',
  weaponKillsAutoRifle: 'Auto Rifle',
  weaponKillsSniper: 'Sniper Rifle',
  weaponKillsShotgun: 'Shotgun',
  weaponKillsFusionRifle: 'Fusion Rifle',
  weaponKillsRocketLauncher: 'Launcher',
  weaponKillsMachinegun: 'Machine Gun',
  weaponKillsSideArm: 'Sidearm',
  weaponKillsSword: 'Sword'
};

// Class nodes definitions
var VIKING_FUNERAL = 2443566286;
var TOUCH_OF_FLAME = 2233737290;
var IONIC_BLINK = 2719650973;
var JUMP_BLINK = 3452380660;

// Weapon + Armor node definitions
var QUICKDRAW = 3409718360;
var FORCE_MULTI = [910871216, 910871217];

// Cooldowns
var cooldownsSuperA  = ['5:00', '4:46', '4:31', '4:15', '3:58', '3:40'];
var cooldownsSuperB  = ['5:30', '5:14', '4:57', '4:39', '4:20', '4:00'];
var cooldownsGrenade = ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25'];
var cooldownsMeleeA  = ['1:10', '1:04', '0:57', '0:49', '0:40', '0:29'];
var cooldownsMeleeB  = ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25'];

// Nodes hidden from weapon and armor stats
var hiddenNodes = [
  74523350,   // Cannibalism
  193091484,  // Increase Strength
  213547364,  // Will of Light
  217480046,  // Twist Fate
  300289986,  // Dreg Burn
  431265444,  // Mutineer
  472357138,  // Void Damage
  617082448,  // Reforge Ready
  643689081,  // Kinetic Damage
  994456416,  // Burgeoning Hunger
  1034209669, // Increase Intellect
  1263323987, // Increase Discipline
  1270552711, // Infuse
  1305317488, // Aspect Swap
  1450441122, // Demotion
  1644354530, // Sword Strike
  1782221257, // Shank Burn
  1891493121, // Dark Breaker
  1920788875, // Ascend
  1975859941, // Solar Damage
  2086308543, // Upgrade Defense
  2470010183, // Hive Disruptor
  2688431654, // Arc Damage
  2689436406, // Upgrade Damage
  2845051978, // Ice Breaker
  2978058659, // Oracle Disruptor
  3200611139, // Scabbard
  3575189929, // Hands-On
  3707521590, // Vandal Burn
  3742851299, // Lich Bane
  3985040583, // Disciplinarian
  4197414939  // Inverse Shadow
];
