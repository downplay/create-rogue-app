// TODO: Maybe specify the name more e.g. GamePosition
export type Position = {
    x: number
    y: number
}

export type Quad = Position & {
    width: number
    height: number
}
