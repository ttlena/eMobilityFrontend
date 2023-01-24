import { reactive, readonly } from "vue"
import { IMyMapsListItem } from "../typings/IMyMapsListitem"
import { IMyMapsState } from "../typings/IMyMapsState"
import { IAddMyMapsRequestDTO} from  "../typings/IAddMyMapsRequestDTO"
import { IMapDTO } from "../typings/IMapDTO"

const mapsState = reactive<IMyMapsState>({
    mapslist: Array<IMapDTO>(),
    errormsg: "",
})

//temporary function to test MyMapsList
export function useMyMaps() {
    //let date: Date = new Date(500000);
    for (let i = 0; i < 4; i++) {
        mapsState.mapslist.push({userId: 1,  lobbyName: "Karte " + i, date: "hallo" })
    }

    return {
        mapsList: mapsState,
        test_list: mapsState.mapslist,
    }
}

export async function updateMapsList(): Promise<void> {
    const url = "api/map"

    try {
        const response = await fetch(url, {
            method: "GET"
        })

        if(!response.ok) {
            mapsState.errormsg = response.statusText
            mapsState.mapslist = []
            console.log("error in fetching maplist")
            throw new Error(response.statusText)
        }

        const jsondata: IMapDTO[] = await response.json()

        mapsState.mapslist = jsondata
        mapsState.errormsg = ""
    }catch (error) {
        console.log("error in updateMapsList")
    }
}

export async function createNewMap(addUserId: number, addMapName: string){
    const url = "/api/map"

    const addMap: IAddMyMapsRequestDTO = {
        userId: addUserId,
        lobbyName: addMapName,
        date: getCurrentDate()
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addMap),
        })
        let id = await res.json()
        await updateMapsList()
    } catch (error) {
        console.log(error)
        return -1
    }

    function getCurrentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();

       return (dd + '/' + mm + '/' + yyyy);
    }

}
