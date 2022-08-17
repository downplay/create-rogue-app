import { Ref, useCallback, useEffect, useRef } from "react"
import { useMeasure } from "react-use"
import styled from "styled-components"
import { Scene, PerspectiveCamera, WebGLRenderer, Camera } from "three"
import { defineAction, dispatchAction, onAction, UPDATE_ENTITY } from "../engine/action"
import { getSelf } from "../engine/entity"
import { EntityInstance } from "../engine/types"
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
    console.log("ME", me)
    const [sizeRef, { width, height /*x, y, top, right, bottom, left*/ }] = useMeasure()
    const containerRef = useRef<HTMLDivElement>(null!)
    // const engine = useEngineContext()
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
        // TODO: Could be more efficient with use of resources here.
        // Additionally when size is changed we could just use renderer.setSize,
        // do this in a separate effect
        console.log("NEW SCENE", width, height)
        sceneRef.current = new Scene()
        cameraRef.current = new PerspectiveCamera(75, width / height, 0.1, 1000)
        cameraRef.current.position.y = 1
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
    // const scene = new Scene()
    // TODO: Bit of a chicken/egg situation here; we need the width/height from the
    // component in order to create the camera with the correct perspective (and
    // update based on component size changes). So we can't just create the camera
    // here and pass to the component. Then we need to receive the camera back
    // here and expose methods to control the camera. Cameras should even be entities
    // in their own right as we want different camera types for different game modes
    // BUT the camera is needed by the rendere. Phew this is fiddly.
    hasComponent(GameCanvas, { props: { name, me /*, scene, camera*/ }, slot })
}

// TODO: Should be a way to access scene/camera from whichever closest parent controls
// them.
// export const getScene = () => {
//     const {scene} = getParentInstance()
// }

export const onSceneCreate = (handler: (payload: SceneActionPayload) => void) => {
    onAction(CREATE_SCENE, handler)
}

export const onSceneRender = (handler: (payload: SceneActionPayload) => void) => {
    onAction(RENDER_SCENE, handler)
}

export const onSceneDestroy = (handler: (payload: SceneActionPayload) => void) => {
    onAction(DESTROY_SCENE, handler)
}
