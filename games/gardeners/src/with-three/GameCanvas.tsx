import { Ref, useCallback, useEffect, useMemo, useRef } from "react"
import { useMeasure } from "react-use"
import styled from "styled-components"
import { Scene, PerspectiveCamera, WebGLRenderer, Camera } from "three"
import { defineAction, onAction, UPDATE_ENTITY } from "../engine/action"
import { dispatchAction, getSelf } from "../engine/entity"
import { EntityInstance } from "../engine/types"
import { useEngineContext } from "../providers/EngineProvider"
import { hasComponent, HasComponentOptions } from "../with-react/ComponentManager"

type GameCanvasProps = {
    name: string
    me: EntityInstance<any, any>
}

const Sized = styled.div`
    width: 100%;
    height: 100%;
`

export type SceneActionPayload = {
    scene: Scene
    camera: Camera
}

export const CREATE_SCENE = defineAction<SceneActionPayload, void>("CREATE_SCENE", {
    cascade: true
})
const RENDER_SCENE = defineAction<SceneActionPayload, void>("RENDER_SCENE", { cascade: true })
export const DESTROY_SCENE = defineAction<SceneActionPayload, void>("DESTROY_SCENE", {
    cascade: true
})

export const GameCanvas = ({ name, me }: GameCanvasProps) => {
    const [sizeRef, { width, height /*x, y, top, right, bottom, left*/ }] = useMeasure()
    const containerRef = useRef<HTMLDivElement>(null!)
    const engine = useEngineContext()
    // const { scope } = engine
    // const containerRef = useRef<HTMLDivElement>(null!)
    const sceneRef = useRef<Scene>(null!)
    // TODO: Should much of this happen inside the entity rather than the component?
    // (including the raf loop)
    // TODO: How do we control the camera?
    const cameraRef = useRef<PerspectiveCamera>(null!)
    const rendererRef = useRef<WebGLRenderer>(null!)
    const animationFrameRef = useRef<number>()
    const render = useCallback(() => {
        // TODO: This should be a function of the game, not the responsibility of
        // Three integration; and actually this render function will just trigger off
        // that, but we need a distinct update then render cycle probably. Just need
        // to make decisions...
        dispatchAction(me, UPDATE_ENTITY, {})
        dispatchAction(me, RENDER_SCENE, { scene: sceneRef.current, camera: cameraRef.current })
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        animationFrameRef.current = requestAnimationFrame(render)
        // TODO: How to do multiple render passes?
    }, [me])

    useEffect(() => {
        // TODO: Scene and camera, do they need to be created/destroyed here
        // or can they be reused when the renderer is initialized?
        // Could be more efficient with use of resources here.
        // Additionally when size is changed we could just use renderer.setSize,
        // do this in a separate effect
        sceneRef.current = new Scene()
        cameraRef.current = new PerspectiveCamera(75, width / height, 0.1, 1000)
        cameraRef.current.position.z = 5
        rendererRef.current = new WebGLRenderer()
        rendererRef.current.setSize(width, height)
        const container = containerRef.current
        container.appendChild(rendererRef.current.domElement)
        animationFrameRef.current = requestAnimationFrame(render)
        dispatchAction(me, CREATE_SCENE, { scene: sceneRef.current, camera: cameraRef.current })

        return () => {
            if (container.lastChild) {
                container.removeChild(container.lastChild)
            }
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            rendererRef.current.dispose()
        }
    }, [me, width, height, render])
    // type: scope === ExecutionScope.Server ? Phaser.HEADLESS : Phaser.AUTO,
    // Disable audio engine entirely for headless
    // autoFocus: scope === ExecutionScope.Client,

    // TODO: Shouldn't really need two divs but the useMeasure ref has a silly type and I'm
    // not sure if it has a .current prop
    return (
        <Sized ref={sizeRef as Ref<HTMLDivElement>}>
            <div ref={containerRef} />
        </Sized>
    )
}

export const withCanvas = ({
    // TODO: Root entity, manage render
    name,
    slot
}: Omit<GameCanvasProps, "me"> & Omit<HasComponentOptions<{}>, "component" | "props">) => {
    // TODO: Should be an easier way for component to reference itself
    // Maybe 'instance' should be a required prop of component
    // Actually we really should just pass handlers...
    const me = getSelf()
    hasComponent(GameCanvas, { props: { name, me }, slot })
}

export const onSceneCreate = (handler: (payload: SceneActionPayload) => void) => {
    onAction(CREATE_SCENE, handler)
}

export const onSceneRender = (handler: (payload: SceneActionPayload) => void) => {
    onAction(RENDER_SCENE, handler)
}

export const onSceneDestroy = (handler: (payload: SceneActionPayload) => void) => {
    onAction(DESTROY_SCENE, handler)
}
