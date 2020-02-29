import { useGame } from "./RogueContext"

// export const fireEvent(game:GameState)

export const useEvent = <T>(key, callback) => {
    const game = useGame()


    return useCallback(((event:T) => {

    })
}