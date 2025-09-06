import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Superhero, Team, AppContextType } from "../types";
import { apiService } from "../services/api";
import { databaseService } from "../database/database";
import { biometricService } from "../services/biometric";

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

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await databaseService.init();

      const [localSuperheroes, localFavorites, localTeams] = await Promise.all([
        databaseService.getAllSuperheroes(),
        databaseService.getFavorites(),
        databaseService.getAllTeams(),
      ]);

      if (localSuperheroes.length > 0) {
        dispatch({ type: "SET_SUPERHEROES", payload: localSuperheroes });
        dispatch({ type: "SET_FAVORITES", payload: localFavorites });
        dispatch({ type: "SET_TEAMS", payload: localTeams });
      } else {
        await refreshSuperheroes();
      }
    } catch (error) {
      console.error("Error initializing app:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Error al inicializar la aplicación",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const refreshSuperheroes = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const superheroes = await apiService.getAllSuperheroes();
      await databaseService.saveSuperheroes(superheroes);

      const [favorites, teams] = await Promise.all([
        databaseService.getFavorites(),
        databaseService.getAllTeams(),
      ]);

      dispatch({ type: "SET_SUPERHEROES", payload: superheroes });
      dispatch({ type: "SET_FAVORITES", payload: favorites });
      dispatch({ type: "SET_TEAMS", payload: teams });
    } catch (error) {
      console.error("Error refreshing superheroes:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Error loading superheroes",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToFavorites = async (superhero: Superhero) => {
    try {
      await databaseService.toggleFavorite(superhero.id);
      dispatch({ type: "TOGGLE_FAVORITE", payload: superhero.id });

      const favorites = await databaseService.getFavorites();
      dispatch({ type: "SET_FAVORITES", payload: favorites });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      dispatch({ type: "SET_ERROR", payload: "Error adding to favorites" });
    }
  };

  const removeFromFavorites = async (superheroId: number) => {
    try {
      await databaseService.toggleFavorite(superheroId);
      dispatch({ type: "TOGGLE_FAVORITE", payload: superheroId });

      const favorites = await databaseService.getFavorites();
      dispatch({ type: "SET_FAVORITES", payload: favorites });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      dispatch({ type: "SET_ERROR", payload: "Error removing from favorites" });
    }
  };

  const createTeam = async (name: string): Promise<string> => {
    try {
      const authResult = await biometricService.authenticate();
      if (!authResult.success) {
        throw new Error(authResult.error?.message || "Authentication failed");
      }

      const teamId = `team_${Date.now()}`;
      const team: Team = {
        id: teamId,
        name,
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await databaseService.createTeam(team);
      dispatch({ type: "ADD_TEAM", payload: team });

      return teamId;
    } catch (error) {
      console.error("Error creating team:", error);
      dispatch({ type: "SET_ERROR", payload: "Error creating team" });
      throw error;
    }
  };

  const addMemberToTeam = async (teamId: string, superhero: Superhero) => {
    try {
      const authResult = await biometricService.authenticate();
      if (!authResult.success) {
        throw new Error(authResult.error?.message || "Authentication failed");
      }

      await databaseService.addMemberToTeam(teamId, superhero.id);
      dispatch({ type: "ADD_MEMBER_TO_TEAM", payload: { teamId, superhero } });

      const teams = await databaseService.getAllTeams();
      dispatch({ type: "SET_TEAMS", payload: teams });
    } catch (error) {
      console.error("Error adding member to team:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Error adding member to team",
      });
      throw error;
    }
  };

  const removeMemberFromTeam = async (teamId: string, superheroId: number) => {
    try {
      const authResult = await biometricService.authenticate();
      if (!authResult.success) {
        throw new Error(authResult.error?.message || "Authentication failed");
      }

      await databaseService.removeMemberFromTeam(teamId, superheroId);
      dispatch({
        type: "REMOVE_MEMBER_FROM_TEAM",
        payload: { teamId, superheroId },
      });
    } catch (error) {
      console.error("Error removing member from team:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Error removing member from team",
      });
      throw error;
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const authResult = await biometricService.authenticate();
      if (!authResult.success) {
        throw new Error(authResult.error?.message || "Authentication failed");
      }

      await databaseService.deleteTeam(teamId);
      dispatch({ type: "DELETE_TEAM", payload: teamId });
    } catch (error) {
      console.error("Error deleting team:", error);
      dispatch({ type: "SET_ERROR", payload: "Error deleting team" });
      throw error;
    }
  };

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
