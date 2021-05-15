import { text } from "@hero/text";
import { entity } from "../../engine/entity";

export const simpleSpriteEntity = (name: string, glyph: string) =>
  entity(text`
Type:
${name}

Tile:
${glyph}
`);
