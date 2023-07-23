import { useCallback } from "react"
import Rodal from "rodal"
import { useAtom } from "jotai"
import "rodal/lib/rodal.css"
import { recruitModalVisibleAtom } from "../model/recruits"
import { Recruit } from "./Recruit"

export const Modals = () => {
    const [recruitVisible, setRecruitVisible] = useAtom(recruitModalVisibleAtom)
    const handleRecruitClose = useCallback(() => {
        setRecruitVisible(false)
    }, [setRecruitVisible])

    return (
        <>
            <Rodal visible={recruitVisible} onClose={handleRecruitClose}>
                {recruitVisible && <Recruit />}
            </Rodal>
        </>
    )
}
