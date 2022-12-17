import { computed, reactive, readonly } from "vue";
import User from '../typings/IUser';
import { E_LobbyMode } from "../typings/E_LobbyMode";
import { ILobby } from "../typings/ILobby";
import { ILobbyDTO } from "../typings/ILobbyDTO";

const state = reactive<User>({
  userId:  undefined,
  userName: "",
  activeLobby: {
    lobbyId: -1,
    mapId: -1,
    lobbyName: "",
    numOfPlayers: 0,
    lobbyModeEnum: E_LobbyMode.BUILD_MODE,
    playerList: []
  }
});

function setId(id:number): void {
  state.userId = id;
}

function setName(name: string): void {
  state.userName = name;
}

async function sendName():Promise<void> {
  const response = await fetch('/api/player', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      userName: state.userName
    })
  });

  console.log("sendName():", response);
  const jsondata = await response.json();
  setId(Number(jsondata));
  console.log("state.userId", state.userId);
}

async function setActiveLobby(id: ILobby):Promise<void> {
  //state.activeLobby = lobby;
  

  const url = "/api/lobby";

 try {
    const response = await fetch(`${url}/${id}`, { method: "GET" });
    if (!response.ok) {
     console.log("can't get active lobby");
    }
    const jsondata: ILobbyDTO = await response.json();
    state.activeLobby.lobbyId = jsondata.lobbyId;
    state.activeLobby.lobbyModeEnum = jsondata.lobbyModeEnum;
    state.activeLobby.lobbyName = jsondata.lobbyName;
    state.activeLobby.mapId = jsondata.mapId;
    state.activeLobby.numOfPlayers = jsondata.numOfPlayers;
    state.activeLobby.playerList = jsondata.playerList;
    
  } catch (error) {
     console.log(error);
   }
   //await postActiveLobby(lobby);
   
  //state.activeLobby.playerList?.push(state);
}

async function postActiveLobby(lobby:ILobby) {
  const response = await fetch(`/api/lobby/get_players/${lobby.lobbyId}?player_id=${state.userId}`, {
    method: 'POST',
  });
  console.log("setActiveLobby() -> post player to lobby - response", response);
}

function updateActiveLobbyPlayerList(players: User[]) {
  for (let p of players) {
    state.activeLobby.playerList?.push(p);
  }
  console.log(state.activeLobby.playerList);
}

export default function useUser() {
  return {
    name: computed(() => state.userName),
    userId: computed(() => state.userId ),
    activeLobby: computed(() => state.activeLobby),
    user: readonly<User>(state),
    setName,
    setId,
    sendName,
    setActiveLobby,
    updateActiveLobbyPlayerList
  };
}

