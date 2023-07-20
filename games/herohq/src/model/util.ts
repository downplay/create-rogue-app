export const mapSequence = <T>(start: number, end: number, callback: (n: number) => T) => {
    const map = []
    for (let n = start; n <= end; n++) {
        map.push(callback(n))
    }
    return map
}

export const mapIds = <T extends { id: string }>(items: T[]) =>
    items.reduce((acc, cur) => {
        acc[cur.id] = cur
        return acc
    }, {} as Record<string, T>)
