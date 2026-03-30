import z from 'zod';
import { ItemLevelStats } from './rows';

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

export const RawItemLevelSchema = z.record(z.string(), ItemLevelStats);

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
    map:          z.number().int().optional(),
    zoneid:       z.number().int().nullable().optional(),
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

export const RawRecipesSchema = z.array(z.object({
    id:                     z.union([z.number().int(), z.string()]),
    job:                    z.number().int(),
    lvl:                    z.number().int(),
    yields:                 z.number().int(),
    result:                 z.number().int(),
    stars:                  z.number().int(),
    qs:                     z.boolean().optional().default(false),
    hq:                     z.boolean().optional().default(false),
    durability:             z.number().int().default(0),
    quality:                z.number().int().default(0),
    progress:               z.number().int().default(0),
    progressDivider:        z.number().int().default(0),
    progressModifier:       z.number().int().default(0),
    qualityDivider:         z.number().int().default(0),
    qualityModifier:        z.number().int().default(0),
    difficultyFactor:       z.number().int().default(0),
    durabilityFactor:       z.number().int().default(0),
    qualityFactor:          z.number().int().default(0),
    controlReq:             z.number().int().default(0),
    craftsmanshipReq:       z.number().int().default(0),
    rlvl:                   z.number().int().default(0),
    requiredQuality:        z.number().int().default(0),
    suggestedCraftsmanship: z.number().int().default(0),
    masterbook:             z.number().int().nullable().optional(),
    maxAdjustableJobLevel:  z.number().int().default(0),
    expert:                 z.boolean().optional().default(false),
    conditionsFlag:         z.number().int().default(0),
    isIslandRecipe:         z.boolean().optional().default(false),
    ingredients:            z.array(RawRecipeIngredientSchema).default([]),
}));

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type MultiLang               = z.infer<typeof multiLang>;
export type RawItems                = z.infer<typeof RawItemsSchema>;
export type RawItemIcons            = z.infer<typeof RawItemIconsSchema>;
export type RawJobName              = z.infer<typeof RawJobNameSchema>;
export type RawPlaces               = z.infer<typeof RawPlacesSchema>;
export type RawMapEntry             = z.infer<typeof RawMapEntrySchema>;
export type RawMobs                 = z.infer<typeof RawMobsSchema>;
export type RawMonsterPosition      = z.infer<typeof RawMonsterPositionSchema>;
export type RawMonsters             = z.infer<typeof RawMonstersSchema>;
export type RawDropSources          = z.infer<typeof RawDropSourcesSchema>;
export type RawGatheringTypes       = z.infer<typeof RawGatheringTypesSchema>;
export type RawGatheringItems       = z.infer<typeof RawGatheringItemsSchema>;
export type RawGatheringLevels      = z.infer<typeof RawGatheringLevelsSchema>;
export type RawGatheringSearchIndex = z.infer<typeof RawGatheringSearchIndexSchema>;
export type RawNodes                = z.infer<typeof RawNodesSchema>;
export type RawRecipeIngredient     = z.infer<typeof RawRecipeIngredientSchema>;
export type RawRecipes              = z.infer<typeof RawRecipesSchema>;