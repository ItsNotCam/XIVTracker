import z from 'zod';

export type XIVTeamcraftMeta = z.infer<typeof XIVTeamcraftMeta>;
export const XIVTeamcraftMeta = z.object({ 
	version: z.date()
})

export type TeamcraftApiMeta = z.infer<typeof TeamcraftApiMeta>;
export const TeamcraftApiMeta = z.array(z.object({
	published_at: z.string().min(1)
})).min(1)

// ─── Shared ───────────────────────────────────────────────────────────────────

export const multiLang = z.object({
    en: z.string().optional(),
    de: z.string().optional(),
    ja: z.string().optional(),
    fr: z.string().optional(),
});

// ─── Items ────────────────────────────────────────────────────────────────────

export const RawItemsSchema = z.record(z.string(), multiLang);
export const RawItemIconsSchema = z.record(z.string(), z.string());

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const RawJobNameSchema = z.record(z.string(), multiLang);

// ─── Places ───────────────────────────────────────────────────────────────────

export const RawPlacesSchema = z.record(z.string(), multiLang);

// ─── Map Entries ──────────────────────────────────────────────────────────────

export const RawMapEntrySchema = z.array(z.object({
    id:          z.number().int(),
    name:        z.string(),
    zone:        z.number().int().nullable(),
    territory:   z.number().int().nullable(),
    scale:       z.number().int().nullable(),
    weatherRate: z.number().int().nullable(),
}));

// ─── Mobs ─────────────────────────────────────────────────────────────────────

export const RawMobsSchema = z.record(z.string(), multiLang);

// ─── Monsters ─────────────────────────────────────────────────────────────────

export const RawMonsterPositionSchema = z.object({
    map:    z.number().int(),
    zoneid: z.number().int(),
    level:  z.number().int(),
    hp:     z.number().int(),
    fate:   z.number().int(),
    x:      z.number(),
    y:      z.number(),
    z:      z.number(),
});

export const RawMonstersSchema = z.record(z.string(), z.object({
    baseid:    z.number().int(),
    positions: z.array(RawMonsterPositionSchema),
}));

// ─── Drop Sources ─────────────────────────────────────────────────────────────

export const RawDropSourcesSchema = z.record(z.string(), z.array(z.number().int()));

// ─── Item Level ───────────────────────────────────────────────────────────────

export const ItemLevel = z.object({
    AdditionalEffect:        z.number().int(),
    AttackMagicPotency:      z.number().int(),
    AttackPower:             z.number().int(),
    AttackSpeed:             z.number().int(),
    BindResistance:          z.number().int(),
    BlindResistance:         z.number().int(),
    BlockRate:               z.number().int(),
    BlockStrength:           z.number().int(),
    BluntResistance:         z.number().int(),
    CP:                      z.number().int(),
    CarefulDesynthesis:      z.number().int(),
    Control:                 z.number().int(),
    Craftsmanship:           z.number().int(),
    CriticalHit:             z.number().int(),
    CriticalHitEvasion:      z.number().int(),
    CriticalHitPower:        z.number().int(),
    CriticalHitResilience:   z.number().int(),
    Defense:                 z.number().int(),
    Delay:                   z.number().int(),
    Determination:           z.number().int(),
    Dexterity:               z.number().int(),
    DirectHitRate:           z.number().int(),
    DoomResistance:          z.number().int(),
    EXPBonus:                z.number().int(),
    EarthResistance:         z.number().int(),
    EnfeeblingMagicPotency:  z.number().int(),
    EnhancementMagicPotency: z.number().int(),
    Enmity:                  z.number().int(),
    EnmityReduction:         z.number().int(),
    Evasion:                 z.number().int(),
    FireResistance:          z.number().int(),
    GP:                      z.number().int(),
    Gathering:               z.number().int(),
    HP:                      z.number().int(),
    Haste:                   z.number().int(),
    HealingMagicPotency:     z.number().int(),
    HeavyResistance:         z.number().int(),
    IceResistance:           z.number().int(),
    IncreasedSpiritbondGain: z.number().int(),
    Intelligence:            z.number().int(),
    LightningResistance:     z.number().int(),
    MP:                      z.number().int(),
    MagicDefense:            z.number().int(),
    MagicResistance:         z.number().int(),
    MagicalDamage:           z.number().int(),
    Mind:                    z.number().int(),
    Morale:                  z.number().int(),
    MovementSpeed:           z.number().int(),
    ParalysisResistance:     z.number().int(),
    Perception:              z.number().int(),
    PetrificationResistance: z.number().int(),
    PhysicalDamage:          z.number().int(),
    PiercingResistance:      z.number().int(),
    Piety:                   z.number().int(),
    PoisonResistance:        z.number().int(),
    ProjectileResistance:    z.number().int(),
    ReducedDurabilityLoss:   z.number().int(),
    Refresh:                 z.number().int(),
    Regen:                   z.number().int(),
    SilenceResistance:       z.number().int(),
    SkillSpeed:              z.number().int(),
    SlashingResistance:      z.number().int(),
    SleepResistance:         z.number().int(),
    SlowResistance:          z.number().int(),
    SpellSpeed:              z.number().int(),
    Spikes:                  z.number().int(),
    Strength:                z.number().int(),
    StunResistance:          z.number().int(),
    TP:                      z.number().int(),
    Tenacity:                z.number().int(),
    Vitality:                z.number().int(),
    WaterResistance:         z.number().int(),
    WindResistance:          z.number().int(),
})
export const RawItemLevelSchema = z.record(z.string(), ItemLevel);

// ─── Gathering Types ──────────────────────────────────────────────────────────

export const RawGatheringTypesSchema = z.record(z.string(), multiLang);

// ─── Gathering Items ──────────────────────────────────────────────────────────

export const RawGatheringItemsSchema = z.record(z.string(), z.object({
    itemId:         z.number().int(),
    level:          z.number().int(),
    stars:          z.number().int(),
    hidden:         z.number().int().default(0),
    perceptionReq:  z.number().int().default(0),
    sublimeVariant: z.number().int().nullable().optional(),
    sublimeOf:      z.number().int().nullable().optional(),
}));

// ─── Gathering Levels ─────────────────────────────────────────────────────────

export const RawGatheringLevelsSchema = z.record(z.string(), z.number().int());

// ─── Gathering Search Index ───────────────────────────────────────────────────

export const RawGatheringSearchIndexSchema = z.record(z.string(), z.object({
    reduction: z.boolean().optional().default(false),
    types:     z.array(z.number().int()).optional().default([]),
}));

// ─── Nodes ────────────────────────────────────────────────────────────────────

export const RawNodesSchema = z.record(z.string(), z.object({
    level:        z.number().int(),
    type:         z.number().int(),
    map:          z.number().int(),
    zoneId:       z.number().int().nullable().optional(),
    base:         z.number().int().nullable().optional(),
    folklore:     z.number().int().nullable().optional(),
    duration:     z.number().int().nullable().optional(),
    radius:       z.number().int().nullable().optional(),
    x:            z.number().nullable().optional(),
    y:            z.number().nullable().optional(),
    z:            z.number().nullable().optional(),
    limited:      z.boolean().optional().default(false),
    legendary:    z.boolean().optional().default(false),
    ephemeral:    z.boolean().optional().default(false),
    items:        z.array(z.number().int()).optional().default([]),
    hiddenItems:  z.array(z.number().int()).optional().default([]),
    sublimeItems: z.array(z.object({
        source:  z.number().int(),
        sublime: z.number().int(),
    })).optional().default([]),
    spawns: z.array(z.number().int()).optional().default([]),
}));

// ─── Recipes ──────────────────────────────────────────────────────────────────

export const RawRecipeIngredientSchema = z.object({
    id:      z.number().int(),
    amount:  z.number().int(),
    quality: z.number().int().default(0),
});

export const RawRecipesSchema = z.record(z.string(), z.object({
    id:                     z.number().int(),
    job:                    z.number().int(),
    lvl:                    z.number().int(),
    yields:                 z.number().int(),
    result:                 z.number().int(),
    stars:                  z.number().int(),
    qs:                     z.boolean().optional().default(false),
    hq:                     z.boolean().optional().default(false),
    durability:             z.number().int(),
    quality:                z.number().int(),
    progress:               z.number().int(),
    progressDivider:        z.number().int(),
    progressModifier:       z.number().int(),
    qualityDivider:         z.number().int(),
    qualityModifier:        z.number().int(),
    difficultyFactor:       z.number().int(),
    durabilityFactor:       z.number().int(),
    qualityFactor:          z.number().int(),
    controlReq:             z.number().int().default(0),
    craftsmanshipReq:       z.number().int().default(0),
    rlvl:                   z.number().int(),
    requiredQuality:        z.number().int().default(0),
    suggestedCraftsmanship: z.number().int().default(0),
    masterbook:             z.number().int().nullable().optional(),
    maxAdjustableJobLevel:  z.number().int().default(0),
    expert:                 z.boolean().optional().default(false),
    conditionsFlag:         z.number().int(),
    isIslandRecipe:         z.boolean().optional().default(false),
    ingredients:            z.array(RawRecipeIngredientSchema).default([]),
}));

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type MultiLang                = z.infer<typeof multiLang>;
export type RawItems                 = z.infer<typeof RawItemsSchema>;
export type RawItemIcons             = z.infer<typeof RawItemIconsSchema>;
export type RawJobName               = z.infer<typeof RawJobNameSchema>;
export type RawPlaces                = z.infer<typeof RawPlacesSchema>;
export type RawMapEntry              = z.infer<typeof RawMapEntrySchema>;
export type RawMobs                  = z.infer<typeof RawMobsSchema>;
export type RawMonsterPosition       = z.infer<typeof RawMonsterPositionSchema>;
export type RawMonsters              = z.infer<typeof RawMonstersSchema>;
export type RawDropSources           = z.infer<typeof RawDropSourcesSchema>;
export type RawItemLevel             = z.infer<typeof RawItemLevelSchema>;
export type RawGatheringTypes        = z.infer<typeof RawGatheringTypesSchema>;
export type RawGatheringItems        = z.infer<typeof RawGatheringItemsSchema>;
export type RawGatheringLevels       = z.infer<typeof RawGatheringLevelsSchema>;
export type RawGatheringSearchIndex  = z.infer<typeof RawGatheringSearchIndexSchema>;
export type RawNodes                 = z.infer<typeof RawNodesSchema>;
export type RawRecipeIngredient      = z.infer<typeof RawRecipeIngredientSchema>;
export type RawRecipes               = z.infer<typeof RawRecipesSchema>;
