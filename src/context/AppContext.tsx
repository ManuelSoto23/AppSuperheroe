import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Superhero, Team, AppContextType } from "../types";

interface AppState {
  superheroes: Superhero[];
  favorites: Superhero[];
  teams: Team[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUPERHEROES"; payload: Superhero[] }
  | { type: "SET_FAVORITES"; payload: Superhero[] }
  | { type: "SET_TEAMS"; payload: Team[] }
  | { type: "TOGGLE_FAVORITE"; payload: number }
  | { type: "ADD_TEAM"; payload: Team }
  | { type: "DELETE_TEAM"; payload: string }
  | {
      type: "ADD_MEMBER_TO_TEAM";
      payload: { teamId: string; superhero: Superhero };
    }
  | {
      type: "REMOVE_MEMBER_FROM_TEAM";
      payload: { teamId: string; superheroId: number };
    };

const initialState: AppState = {
  superheroes: [],
  favorites: [],
  teams: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUPERHEROES":
      return { ...state, superheroes: action.payload };
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        superheroes: state.superheroes.map((hero) =>
          hero.id === action.payload
            ? { ...hero, isFavorite: !hero.isFavorite }
            : hero
        ),
        favorites: state.favorites.filter((hero) => hero.id !== action.payload),
      };
    case "ADD_TEAM":
      return { ...state, teams: [...state.teams, action.payload] };
    case "DELETE_TEAM":
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.payload),
      };
    case "ADD_MEMBER_TO_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? { ...team, members: [...team.members, action.payload.superhero] }
            : team
        ),
      };
    case "REMOVE_MEMBER_FROM_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
                ...team,
                members: team.members.filter(
                  (member) => member.id !== action.payload.superheroId
                ),
              }
            : team
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToFavorites = async (superhero: Superhero) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: superhero.id });
  };

  const removeFromFavorites = async (superheroId: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: superheroId });
  };

  const createTeam = async (name: string): Promise<string> => {
    const teamId = `team_${Date.now()}`;
    const team: Team = {
      id: teamId,
      name,
      members: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: "ADD_TEAM", payload: team });
    return teamId;
  };

  const addMemberToTeam = async (teamId: string, superhero: Superhero) => {
    dispatch({ type: "ADD_MEMBER_TO_TEAM", payload: { teamId, superhero } });
  };

  const removeMemberFromTeam = async (teamId: string, superheroId: number) => {
    dispatch({
      type: "REMOVE_MEMBER_FROM_TEAM",
      payload: { teamId, superheroId },
    });
  };

  const deleteTeam = async (teamId: string) => {
    dispatch({ type: "DELETE_TEAM", payload: teamId });
  };

  const refreshSuperheroes = async () => {};

  const value: AppContextType = {
    ...state,
    addToFavorites,
    removeFromFavorites,
    createTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    deleteTeam,
    refreshSuperheroes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
