CREATE TABLE IF NOT EXISTS item (
    id   INTEGER PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    icon VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS job (
    id   INTEGER PRIMARY KEY,
    name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS place (
    id   INTEGER PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS mapEntry (
    id          INTEGER PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,
    zone        INTEGER,
    territory   INTEGER,
    scale       INTEGER,
    weatherRate INTEGER
);

CREATE TABLE IF NOT EXISTS mob (
    id   INTEGER PRIMARY KEY,
    name VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS mobLocation (
    id        INTEGER PRIMARY KEY,
    mobId     INTEGER NOT NULL,
    map       INTEGER NOT NULL,
    zoneId    INTEGER NOT NULL,
    level     INTEGER NOT NULL,
    hp        INTEGER NOT NULL,
    fate      INTEGER NOT NULL,
    x         REAL NOT NULL,
    y         REAL NOT NULL,
    z         REAL NOT NULL,

    FOREIGN KEY (mobId) REFERENCES mob(id)
);

CREATE TABLE IF NOT EXISTS dropSource (
    mobId  INTEGER NOT NULL,
    itemId INTEGER NOT NULL,

    PRIMARY KEY (mobId, itemId)
);

CREATE TABLE IF NOT EXISTS itemLevel (
    id                      INTEGER PRIMARY KEY,
    AdditionalEffect        INTEGER NOT NULL,
    AttackMagicPotency      INTEGER NOT NULL,
    AttackPower             INTEGER NOT NULL,
    AttackSpeed             INTEGER NOT NULL,
    BindResistance          INTEGER NOT NULL,
    BlindResistance         INTEGER NOT NULL,
    BlockRate               INTEGER NOT NULL,
    BlockStrength           INTEGER NOT NULL,
    BluntResistance         INTEGER NOT NULL,
    CP                      INTEGER NOT NULL,
    CarefulDesynthesis      INTEGER NOT NULL,
    Control                 INTEGER NOT NULL,
    Craftsmanship           INTEGER NOT NULL,
    CriticalHit             INTEGER NOT NULL,
    CriticalHitEvasion      INTEGER NOT NULL,
    CriticalHitPower        INTEGER NOT NULL,
    CriticalHitResilience   INTEGER NOT NULL,
    Defense                 INTEGER NOT NULL,
    Delay                   INTEGER NOT NULL,
    Determination           INTEGER NOT NULL,
    Dexterity               INTEGER NOT NULL,
    DirectHitRate           INTEGER NOT NULL,
    DoomResistance          INTEGER NOT NULL,
    EXPBonus                INTEGER NOT NULL,
    EarthResistance         INTEGER NOT NULL,
    EnfeeblingMagicPotency  INTEGER NOT NULL,
    EnhancementMagicPotency INTEGER NOT NULL,
    Enmity                  INTEGER NOT NULL,
    EnmityReduction         INTEGER NOT NULL,
    Evasion                 INTEGER NOT NULL,
    FireResistance          INTEGER NOT NULL,
    GP                      INTEGER NOT NULL,
    Gathering               INTEGER NOT NULL,
    HP                      INTEGER NOT NULL,
    Haste                   INTEGER NOT NULL,
    HealingMagicPotency     INTEGER NOT NULL,
    HeavyResistance         INTEGER NOT NULL,
    IceResistance           INTEGER NOT NULL,
    IncreasedSpiritbondGain INTEGER NOT NULL,
    Intelligence            INTEGER NOT NULL,
    LightningResistance     INTEGER NOT NULL,
    MP                      INTEGER NOT NULL,
    MagicDefense            INTEGER NOT NULL,
    MagicResistance         INTEGER NOT NULL,
    MagicalDamage           INTEGER NOT NULL,
    Mind                    INTEGER NOT NULL,
    Morale                  INTEGER NOT NULL,
    MovementSpeed           INTEGER NOT NULL,
    ParalysisResistance     INTEGER NOT NULL,
    Perception              INTEGER NOT NULL,
    PetrificationResistance INTEGER NOT NULL,
    PhysicalDamage          INTEGER NOT NULL,
    PiercingResistance      INTEGER NOT NULL,
    Piety                   INTEGER NOT NULL,
    PoisonResistance        INTEGER NOT NULL,
    ProjectileResistance    INTEGER NOT NULL,
    ReducedDurabilityLoss   INTEGER NOT NULL,
    Refresh                 INTEGER NOT NULL,
    Regen                   INTEGER NOT NULL,
    SilenceResistance       INTEGER NOT NULL,
    SkillSpeed              INTEGER NOT NULL,
    SlashingResistance      INTEGER NOT NULL,
    SleepResistance         INTEGER NOT NULL,
    SlowResistance          INTEGER NOT NULL,
    SpellSpeed              INTEGER NOT NULL,
    Spikes                  INTEGER NOT NULL,
    Strength                INTEGER NOT NULL,
    StunResistance          INTEGER NOT NULL,
    TP                      INTEGER NOT NULL,
    Tenacity                INTEGER NOT NULL,
    Vitality                INTEGER NOT NULL,
    WaterResistance         INTEGER NOT NULL,
    WindResistance          INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gatheringType (
    id   INTEGER PRIMARY KEY,
    name VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS gatheringItem (
    id             INTEGER PRIMARY KEY,
    itemId         INTEGER NOT NULL,
    level          INTEGER NOT NULL,
    stars          INTEGER NOT NULL,
    hidden         INTEGER NOT NULL DEFAULT 0,
    perceptionReq  INTEGER NOT NULL DEFAULT 0,
    sublimeVariant INTEGER,
    sublimeOf      INTEGER
);

CREATE TABLE IF NOT EXISTS gatheringSearchIndex (
    gatheringItemId INTEGER PRIMARY KEY,
    reduction       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gatheringSearchIndexType (
    gatheringItemId INTEGER NOT NULL,
    type            INTEGER NOT NULL,
    position        INTEGER NOT NULL, 

    PRIMARY KEY (gatheringItemId, position),
    FOREIGN KEY (gatheringItemId) REFERENCES gatheringItem(id)
);

CREATE TABLE IF NOT EXISTS gatheringNode (
    id         INTEGER PRIMARY KEY,
    level      INTEGER NOT NULL,
    type       INTEGER NOT NULL,
    map        INTEGER,
    zoneId     INTEGER,
    base       INTEGER,
    folklore   INTEGER,          
    duration   INTEGER,          
    radius     INTEGER,
    x          REAL,
    y          REAL,
    z          REAL,
    limited    INTEGER NOT NULL DEFAULT 0,
    legendary  INTEGER NOT NULL DEFAULT 0,
    ephemeral  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gatheringNodeItem (
    nodeId INTEGER NOT NULL,
    itemId INTEGER NOT NULL,

    PRIMARY KEY (nodeId, itemId),
    FOREIGN KEY (nodeId) REFERENCES gatheringNode(id),
    FOREIGN KEY (itemId) REFERENCES item(id)
);

CREATE TABLE IF NOT EXISTS gatheringNodeHiddenItem (
    nodeId INTEGER NOT NULL,
    itemId INTEGER NOT NULL,

    PRIMARY KEY (nodeId, itemId),
    FOREIGN KEY (nodeId) REFERENCES gatheringNode(id),
    FOREIGN KEY (itemId) REFERENCES item(id)
);


CREATE TABLE IF NOT EXISTS gatheringNodeSublimeItem (
    nodeId  INTEGER NOT NULL,
    source  INTEGER NOT NULL,
    sublime INTEGER NOT NULL,

    PRIMARY KEY (nodeId, source),
    FOREIGN KEY (nodeId) REFERENCES gatheringNode(id)
);


CREATE TABLE IF NOT EXISTS gatheringNodeSpawn (
    nodeId INTEGER NOT NULL,
    spawn  INTEGER NOT NULL,

    PRIMARY KEY (nodeId, spawn),
    FOREIGN KEY (nodeId) REFERENCES gatheringNode(id)
);

CREATE TABLE IF NOT EXISTS craftingRecipe (
    id                     INTEGER PRIMARY KEY,
    job                    INTEGER NOT NULL,
    lvl                    INTEGER NOT NULL,
    yields                 INTEGER NOT NULL,
    result                 INTEGER NOT NULL,
    stars                  INTEGER NOT NULL,
    qs                     INTEGER NOT NULL DEFAULT 0,
    hq                     INTEGER NOT NULL DEFAULT 0,
    durability             INTEGER NOT NULL,
    quality                INTEGER NOT NULL,
    progress               INTEGER NOT NULL,
    progressDivider        INTEGER NOT NULL,
    progressModifier       INTEGER NOT NULL,
    qualityDivider         INTEGER NOT NULL,
    qualityModifier        INTEGER NOT NULL,
    difficultyFactor       INTEGER NOT NULL,
    durabilityFactor       INTEGER NOT NULL,
    qualityFactor          INTEGER NOT NULL,
    controlReq             INTEGER NOT NULL DEFAULT 0,
    craftsmanshipReq       INTEGER NOT NULL DEFAULT 0,
    rlvl                   INTEGER NOT NULL,
    requiredQuality        INTEGER NOT NULL DEFAULT 0,
    suggestedCraftsmanship INTEGER NOT NULL DEFAULT 0,
    masterbook             INTEGER,          
    maxAdjustableJobLevel  INTEGER NOT NULL DEFAULT 0,
    expert                 INTEGER NOT NULL DEFAULT 0,
    conditionsFlag         INTEGER NOT NULL,
    isIslandRecipe         INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (job)    REFERENCES job(id),
    FOREIGN KEY (result) REFERENCES item(id)
);

CREATE TABLE IF NOT EXISTS craftingIngredient (
    recipeId     INTEGER NOT NULL,
    ingredientId INTEGER NOT NULL,
    amount       INTEGER NOT NULL,
    quality      INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (recipeId, ingredientId),
    FOREIGN KEY (recipeId)     REFERENCES craftingRecipe(id),
    FOREIGN KEY (ingredientId) REFERENCES item(id)
);