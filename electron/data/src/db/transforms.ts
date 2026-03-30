import { z } from 'zod';
import {
    RawItemsSchema,
    RawItemIconsSchema,
    RawJobNameSchema,
    RawPlacesSchema,
    RawMapEntrySchema,
    RawMobsSchema,
    RawMonstersSchema,
    RawDropSourcesSchema,
    RawItemLevelSchema,
    RawGatheringTypesSchema,
    RawGatheringItemsSchema,
    RawGatheringLevelsSchema,
    RawGatheringSearchIndexSchema,
    RawNodesSchema,
    RawRecipesSchema,
} from '../types/raw';

import * as rows from '../types/rows';

// ─── Items ────────────────────────────────────────────────────────────────────

export const DbItemsSchema = RawItemsSchema
    .transform(raw =>
        Object.entries(raw).map(([id, names]) =>
            rows.Item.parse({ id: Number(id), name: names.en ?? names.ja ?? "??", icon: null })
        )
    );

export const DbItemIconsSchema = RawItemIconsSchema
    .transform(raw =>
        Object.entries(raw).map(([id, icon]) => ({ id: Number(id), icon }))
    );

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const DbJobsSchema = RawJobNameSchema
    .transform(raw =>
        Object.entries(raw).map(([id, names]) =>
            rows.Job.parse({ id: Number(id), name: names.en ?? names.ja ?? "??" })
        )
    );

// ─── Places ───────────────────────────────────────────────────────────────────

export const DbPlacesSchema = RawPlacesSchema
    .transform(raw =>
        Object.entries(raw).map(([id, names]) =>
            rows.Place.parse({ id: Number(id), name: names.en ?? names.ja ?? "??" })
        )
    );

// ─── Map Entries ──────────────────────────────────────────────────────────────

export const DbMapEntriesSchema = RawMapEntrySchema
    .transform(raw =>
        Object.values(raw).map(v => rows.MapEntry.parse(v))
    );

// ─── Mobs ─────────────────────────────────────────────────────────────────────

export const DbMobsSchema = RawMobsSchema
    .transform(raw =>
        Object.entries(raw).map(([id, names]) =>
            rows.Mob.parse({ id: Number(id), name: names.en ?? names.ja ?? "??" })
        )
    );

// ─── Monsters ─────────────────────────────────────────────────────────────────

export const DbMonstersSchema = RawMonstersSchema
    .transform(raw =>
        Object.entries(raw).map(([, monster]) => ({
            mob:       rows.Mob.parse({ id: monster.baseid }),
            locations: monster.positions.map(p =>
                rows.MobLocation.parse({
                    mobId:  monster.baseid,
                    map:    p.map,
                    zoneId: p.zoneid,
                    level:  p.level,
                    hp:     p.hp,
                    fate:   p.fate,
                    x:      p.x,
                    y:      p.y,
                    z:      p.z,
                })
            ),
        }))
    );

// ─── Drop Sources ─────────────────────────────────────────────────────────────

export const DbDropSourcesSchema = RawDropSourcesSchema
    .transform(raw =>
        Object.entries(raw).flatMap(([mobId, itemIds]) =>
            itemIds.map(itemId =>
                rows.DropSource.parse({ mobId: Number(mobId), itemId })
            )
        )
    );

// ─── Item Level ───────────────────────────────────────────────────────────────

export const DbItemLevelSchema = RawItemLevelSchema
    .transform(raw =>
        Object.entries(raw).map(([id, stats]) =>
            rows.ItemLevel.parse({ id: Number(id), ...stats })
        )
    );

// ─── Gathering Types ──────────────────────────────────────────────────────────

export const DbGatheringTypesSchema = RawGatheringTypesSchema
    .transform(raw =>
        Object.entries(raw).map(([id, names]) =>
            rows.GatheringType.parse({ id: Number(id), name: names.en ?? names.ja ?? "??" })
        )
    );

// ─── Gathering Items ──────────────────────────────────────────────────────────

export const DbGatheringItemsSchema = RawGatheringItemsSchema
    .transform(raw =>
        Object.entries(raw).map(([id, v]) =>
            rows.GatheringItem.parse({
                id: Number(id),
                ...v,
                sublimeVariant: v.sublimeVariant || null,
                sublimeOf:      v.sublimeOf      || null,
            })
        )
    );

// ─── Gathering Levels ─────────────────────────────────────────────────────────

export const DbGatheringLevelsSchema = RawGatheringLevelsSchema
    .transform(raw =>
        Object.entries(raw).map(([id, level]) => ({ id: Number(id), level }))
    );

// ─── Gathering Search Index ───────────────────────────────────────────────────

export const DbGatheringSearchIndexSchema = RawGatheringSearchIndexSchema
    .transform(raw =>
        Object.entries(raw).map(([id, v]) => ({
            index: rows.GatheringSearchIndex.parse({
                gatheringItemId: Number(id),
                reduction:       v.reduction ? 1 : 0,
            }),
            types: v.types.map((type, position) =>
                rows.GatheringSearchIndexType.parse({
                    gatheringItemId: Number(id),
                    type,
                    position,
                })
            ),
        }))
    );

// ─── Nodes ────────────────────────────────────────────────────────────────────

export const DbNodesSchema = RawNodesSchema
    .transform(raw =>
        Object.entries(raw).map(([id, v]) => ({
            node: rows.GatheringNode.parse({
                id:        Number(id),
                level:     v.level,
                type:      v.type,
                map:       v.map       ?? null,
                zoneId:    v.zoneid    ?? null,
                base:      v.base      ?? null,
                folklore:  v.folklore  ?? null,
                duration:  v.duration  ?? null,
                radius:    v.radius    ?? null,
                x:         v.x         ?? null,
                y:         v.y         ?? null,
                z:         v.z         ?? null,
                limited:   v.limited   ? 1 : 0,
                legendary: v.legendary ? 1 : 0,
                ephemeral: v.ephemeral ? 1 : 0,
            }),
            items:        v.items.map(itemId =>
                rows.GatheringNodeItem.parse({ nodeId: Number(id), itemId })
            ),
            hiddenItems:  v.hiddenItems.map(itemId =>
                rows.GatheringNodeHiddenItem.parse({ nodeId: Number(id), itemId })
            ),
            sublimeItems: v.sublimeItems.map(s =>
                rows.GatheringNodeSublimeItem.parse({ nodeId: Number(id), source: s.source, sublime: s.sublime })
            ),
            spawns:       v.spawns.map(spawn =>
                rows.GatheringNodeSpawn.parse({ nodeId: Number(id), spawn })
            ),
        }))
    );

// ─── Recipes ──────────────────────────────────────────────────────────────────

export const DbRecipesSchema = RawRecipesSchema
    .transform(raw =>
        raw.flatMap(v => {
            if (typeof v.id !== 'number') return [];
            return [{
            recipe: rows.CraftingRecipe.parse({
                id:                     v.id,
                job:                    v.job,
                lvl:                    v.lvl,
                yields:                 v.yields,
                result:                 v.result,
                stars:                  v.stars,
                qs:                     v.qs            ? 1 : 0,
                hq:                     v.hq            ? 1 : 0,
                durability:             v.durability,
                quality:                v.quality,
                progress:               v.progress,
                progressDivider:        v.progressDivider,
                progressModifier:       v.progressModifier,
                qualityDivider:         v.qualityDivider,
                qualityModifier:        v.qualityModifier,
                difficultyFactor:       v.difficultyFactor,
                durabilityFactor:       v.durabilityFactor,
                qualityFactor:          v.qualityFactor,
                controlReq:             v.controlReq,
                craftsmanshipReq:       v.craftsmanshipReq,
                rlvl:                   v.rlvl,
                requiredQuality:        v.requiredQuality,
                suggestedCraftsmanship: v.suggestedCraftsmanship,
                masterbook:             v.masterbook    ?? null,
                maxAdjustableJobLevel:  v.maxAdjustableJobLevel,
                expert:                 v.expert        ? 1 : 0,
                conditionsFlag:         v.conditionsFlag,
                isIslandRecipe:         v.isIslandRecipe ? 1 : 0,
            }),
            ingredients: v.ingredients.map(i =>
                rows.CraftingIngredient.parse({
                    recipeId:     v.id,
                    ingredientId: i.id,
                    amount:       i.amount,
                    quality:      i.quality,
                })
            ),
        }]})
    );

// ─── Inferred Output Types ────────────────────────────────────────────────────

export type DbItems                  = z.infer<typeof DbItemsSchema>;
export type DbItemIcons              = z.infer<typeof DbItemIconsSchema>;
export type DbJobs                   = z.infer<typeof DbJobsSchema>;
export type DbPlaces                 = z.infer<typeof DbPlacesSchema>;
export type DbMapEntries             = z.infer<typeof DbMapEntriesSchema>;
export type DbMobs                   = z.infer<typeof DbMobsSchema>;
export type DbMonsters               = z.infer<typeof DbMonstersSchema>;
export type DbDropSources            = z.infer<typeof DbDropSourcesSchema>;
export type DbItemLevel              = z.infer<typeof DbItemLevelSchema>;
export type DbGatheringTypes         = z.infer<typeof DbGatheringTypesSchema>;
export type DbGatheringItems         = z.infer<typeof DbGatheringItemsSchema>;
export type DbGatheringLevels        = z.infer<typeof DbGatheringLevelsSchema>;
export type DbGatheringSearchIndex   = z.infer<typeof DbGatheringSearchIndexSchema>;
export type DbNodes                  = z.infer<typeof DbNodesSchema>;
export type DbRecipes                = z.infer<typeof DbRecipesSchema>;
