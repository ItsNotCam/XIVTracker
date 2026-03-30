import { z } from 'zod';

// ─── Primitives ───────────────────────────────────────────────────────────────

export const Item = z.object({
    id:   z.number().int(),
    name: z.string(),
    icon: z.string().nullable().optional(),
});
export type Item = z.infer<typeof Item>;

export const Job = z.object({
    id:   z.number().int(),
    name: z.string(),
});
export type Job = z.infer<typeof Job>;

export const Place = z.object({
    id:   z.number().int(),
    name: z.string().nullable().optional(),
});
export type Place = z.infer<typeof Place>;

export const MapEntry = z.object({
    id:          z.number().int(),
    name:        z.string(),
    zone:        z.number().int().nullable(),
    territory:   z.number().int().nullable(),
    scale:       z.number().int().nullable(),
    weatherRate: z.number().int().nullable(),
});
export type MapEntry = z.infer<typeof MapEntry>;

export const Mob = z.object({
    id:   z.number().int(),
    name: z.string().nullable().optional(),
});
export type Mob = z.infer<typeof Mob>;

export const MobLocation = z.object({
    mobId:  z.number().int(),
    map:    z.number().int(),
    zoneId: z.number().int(),
    level:  z.number().int(),
    hp:     z.number().int(),
    fate:   z.number().int(),
    x:      z.number(),
    y:      z.number(),
    z:      z.number(),
});
export type MobLocation = z.infer<typeof MobLocation>;

export const DropSource = z.object({
    mobId:  z.number().int(),
    itemId: z.number().int(),
});
export type DropSource = z.infer<typeof DropSource>;

// ─── Item Level ───────────────────────────────────────────────────────────────

const itemLevelStatsShape = {
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
};

export const ItemLevelStats = z.object(itemLevelStatsShape);
export type ItemLevelStats = z.infer<typeof ItemLevelStats>;

export const ItemLevel = z.object({ id: z.number().int(), ...itemLevelStatsShape });
export type ItemLevel = z.infer<typeof ItemLevel>;

// ─── Gathering ────────────────────────────────────────────────────────────────

export const GatheringType = z.object({
    id:   z.number().int(),
    name: z.string().nullable().optional(),
});
export type GatheringType = z.infer<typeof GatheringType>;

export const GatheringItem = z.object({
    id:             z.number().int(),
    itemId:         z.number().int(),
    level:          z.number().int(),
    stars:          z.number().int(),
    hidden:         z.number().int().default(0),
    perceptionReq:  z.number().int().default(0),
    sublimeVariant: z.number().int().nullable().optional(),
    sublimeOf:      z.number().int().nullable().optional(),
});
export type GatheringItem = z.infer<typeof GatheringItem>;

export const GatheringSearchIndex = z.object({
    gatheringItemId: z.number().int(),
    reduction:       z.number().int().default(0),
});
export type GatheringSearchIndex = z.infer<typeof GatheringSearchIndex>;

export const GatheringSearchIndexType = z.object({
    gatheringItemId: z.number().int(),
    type:            z.number().int(),
    position:        z.number().int(),
});
export type GatheringSearchIndexType = z.infer<typeof GatheringSearchIndexType>;

export const GatheringNode = z.object({
    id:        z.number().int(),
    level:     z.number().int(),
    type:      z.number().int(),
    map:       z.number().int().nullable().optional(),
    zoneId:    z.number().int().nullable().optional(),
    base:      z.number().int().nullable().optional(),
    folklore:  z.number().int().nullable().optional(),
    duration:  z.number().int().nullable().optional(),
    radius:    z.number().int().nullable().optional(),
    x:         z.number().nullable().optional(),
    y:         z.number().nullable().optional(),
    z:         z.number().nullable().optional(),
    limited:   z.number().int().default(0),
    legendary: z.number().int().default(0),
    ephemeral: z.number().int().default(0),
});
export type GatheringNode = z.infer<typeof GatheringNode>;

export const GatheringNodeItem = z.object({
    nodeId: z.number().int(),
    itemId: z.number().int(),
});
export type GatheringNodeItem = z.infer<typeof GatheringNodeItem>;

export const GatheringNodeHiddenItem = z.object({
    nodeId: z.number().int(),
    itemId: z.number().int(),
});
export type GatheringNodeHiddenItem = z.infer<typeof GatheringNodeHiddenItem>;

export const GatheringNodeSublimeItem = z.object({
    nodeId:  z.number().int(),
    source:  z.number().int(),
    sublime: z.number().int(),
});
export type GatheringNodeSublimeItem = z.infer<typeof GatheringNodeSublimeItem>;

export const GatheringNodeSpawn = z.object({
    nodeId: z.number().int(),
    spawn:  z.number().int(),
});
export type GatheringNodeSpawn = z.infer<typeof GatheringNodeSpawn>;

// ─── Crafting ─────────────────────────────────────────────────────────────────

export const CraftingRecipe = z.object({
    id:                     z.number().int(),
    job:                    z.number().int(),
    lvl:                    z.number().int(),
    yields:                 z.number().int(),
    result:                 z.number().int(),
    stars:                  z.number().int(),
    qs:                     z.number().int().default(0),
    hq:                     z.number().int().default(0),
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
    expert:                 z.number().int().default(0),
    conditionsFlag:         z.number().int(),
    isIslandRecipe:         z.number().int().default(0),
});
export type CraftingRecipe = z.infer<typeof CraftingRecipe>;

export const CraftingIngredient = z.object({
    recipeId:     z.number().int(),
    ingredientId: z.number().int(),
    amount:       z.number().int(),
    quality:      z.number().int().default(0),
});
export type CraftingIngredient = z.infer<typeof CraftingIngredient>;