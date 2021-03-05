import { stringify } from "flatted";
import { RNG } from "herotext";
import { createRng } from "../../herotext/src/rng";
import { VirtualGrid, virtualGrid } from "./virtualGrid";
import { BrushNode, BrushNodes } from "./types";
import {
  MapNode,
  NumberNode,
  OperationNode,
  OrOpsNode,
  BrushOpNode,
} from "./types";

type BuildContext = {
  map: MapNode;
  rows: String[][];
  grid: VirtualGrid<MapElement>;
  scope: Record<string, any>;
  rng: RNG;
};

type GlyphTarget = {
  x: number;
  y: number;
  glyph: string;
  index: number;
};

let applyBrushToGlyphTargets: (
  targets: GlyphTarget[],
  brush: BrushNodes | BrushNode,
  context: BuildContext
) => void;

const distributeTargetsToNodes = (
  targets: GlyphTarget[],
  brushes: BrushNode[],
  context: BuildContext
) => {
  // Aggregate nodes into groups
  let totalReserve = 0;
  let totalFraction = 0;
  let fractional = [];
  let unQuantified = [];
  const brushesToTargets = [];

  for (const node of brushes) {
    brushesToTargets.push({
      brush: node.brush,
      targets: [] as GlyphTarget[],
    });
    if (!node.quantifier) {
      unQuantified.push(node);
    } else {
      switch (node.quantifier.type) {
        case "Heromap::PercentageValue": {
          let weight = node.quantifier.value;
          totalFraction += weight;
          fractional.push({
            node,
            weight,
          });
          break;
        }
        case "Heromap::FractionValue":
          let weight = node.quantifier.numerator / node.quantifier.denominator;
          totalFraction += weight;
          fractional.push({
            node,
            weight,
          });
          break;
        default:
          throw new Error("Unhandled quantifier type: " + node.quantifier.type);
      }
    }
  }
  const remainingFraction = 1 - totalFraction;
  const fractionPerUnQuantified =
    remainingFraction > 0 && unQuantified.length > 0
      ? remainingFraction / unQuantified.length
      : 0;
  // Adjust fractions down if we went over 100%.
  const fractionAdjust =
    remainingFraction < 0 && totalFraction > 0 ? 1 / totalFraction : 1;
  // Add the possibility of selecting nothing, if there is remaining fraction to distribute
  const nothing =
    remainingFraction > 0 && fractionPerUnQuantified === 0
      ? [{ weight: remainingFraction, node: null }]
      : [];
  // TODO: Randomly select reserved, leave the rest
  const weightedList = [
    ...fractional.map(({ weight, node }) => ({
      weight: weight * fractionAdjust,
      node,
    })),
    ...unQuantified.map((node) => ({ weight: fractionPerUnQuantified, node })),
    ...nothing,
  ];
  for (const target of targets) {
    const picked =
      weightedList.length === 1
        ? weightedList[0]
        : context.rng.pick(weightedList, "weight");
    if (picked.node) {
      const found = brushesToTargets.find(
        ({ brush }) => brush === picked.node.brush
      );
      found?.targets.push(target);
    }
  }

  for (const brushTarget of brushesToTargets) {
    applyBrushToGlyphTargets(brushTarget.targets, brushTarget.brush, context);
  }
};

applyBrushToGlyphTargets = (
  targets: GlyphTarget[],
  brush: BrushNodes | BrushNode,
  context: BuildContext
) => {
  if (typeof brush === "undefined" || !brush.type) {
    throw new Error("Not a brush node: " + JSON.stringify(brush));
  }
  switch (brush.type) {
    case "Heromap::BrushNode":
      // if (brush.quantifier) {
      // const quantifiedTargets = quantifyTargets(targets, quantifier, rng);
      // }
      applyBrushToGlyphTargets(targets, brush.brush, context);
      break;
    case "Heromap::AndBrushesNode":
      for (const and of brush.brushes) {
        applyBrushToGlyphTargets(targets, and, context);
      }
      break;
    case "Heromap::OrBrushesNode":
      distributeTargetsToNodes(targets, brush.brushes, context);
      break;
    case "Heromap::GlyphNode":
      for (const target of targets) {
        context.rows[target.y][target.x] = brush.glyph;
      }
      break;
    case "Heromap::WordNode":
      if (brush.path.length > 1) {
        throw new Error("Path chaining not supported: " + brush.path.join("."));
      }
      for (const target of targets) {
        context.grid.add(target.x, target.y, {
          type: brush.path[0],
          params: {}, // TODO: Params
        });
      }
      break;

    default:
      throw new Error("Unhandled brush type: " + brush.type);
  }
};

const applyBrushToGlyphs = (
  glyphs: string[],
  brush: BrushNode,
  context: BuildContext
) => {
  // TODO: Expand to have both GlyphTarget and ScopeTarget, logic for setting
  // scope will be a bit different
  // TODO: Could optimise a little by creating
  // an index up fromnt
  const targets: GlyphTarget[] = [];
  glyphs.forEach((glyph, index) => {
    // TODO: We will need to use VirtualGrid in the end
    // because we might need to set glyphs outside of
    // the initial range
    context.rows.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === glyph) {
          targets.push({ x, y, glyph, index }); // TODO: Is glyph needed?
        }
      });
    });
  });

  applyBrushToGlyphTargets(targets, brush, context);
};

const executeBrushOpNode = (op: BrushOpNode, context: BuildContext) => {
  if (!op.target) {
    throw new Error("Missing target: " + stringify(op, null, "  "));
  }
  switch (op.target.type) {
    case "Heromap::WordNode":
      // storeBrushInScope(op.target.path, op.brush, context);
      break;
    default: {
      let glyphs;
      switch (op.target.type) {
        case "Heromap::GlyphNode":
          glyphs = [op.target.glyph];
          break;
        case "Heromap::GlyphsNode":
          glyphs = op.target.glyphs;
          break;
        default:
          throw new Error("Unhandled op target type " + op.type);
      }
      applyBrushToGlyphs(glyphs, op.brush, context);
    }
  }
};

const executeOp = (op: OperationNode, context: BuildContext) => {
  if (!op || !op.type) {
    throw new Error("Invalid OperationNode: " + stringify(op, null, "  "));
  }
  switch (op.type) {
    case "Heromap::BrushOpNode":
      executeBrushOpNode(op as BrushOpNode, context);
      break;
    default:
      throw new Error("Unhandled node type " + op.type);
  }
};

export type MapElement = {
  type: string;
  params: Record<string, any>;
};

export const build = (
  map: MapNode,
  rng: RNG = createRng(),
  scope: Record<string, any> = {}
) => {
  const width = Math.max(...map.lines.map((line) => line.length));
  const height = map.lines.length;
  const rows = map.lines.map((line) => line.split(""));
  const grid = virtualGrid<MapElement>(width, height);
  const context: BuildContext = {
    map,
    grid,
    rows,
    scope,
    rng,
  };
  for (const op of map.legend) {
    executeOp(op, context);
  }
  // TODO: Any other metadata?
  return {
    // TODO: These bounds haven't been computed
    bounds: {
      x: 0,
      y: 0,
      width: grid.width,
      height: grid.height,
      rows: context.rows,
    },
    cells: grid.getCells(),
  };
};
