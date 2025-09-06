export interface Superhero {
  id: number;
  name: string;
  slug: string;
  powerstats: PowerStats;
  appearance: Appearance;
  biography: Biography;
  work: Work;
  connections: Connections;
  images: Images;
  powerScore?: number;
  isFavorite?: boolean;
}

export interface PowerStats {
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
  combat: string;
}

export interface Appearance {
  gender: string;
  race: string;
  height: string[];
  weight: string[];
  eyeColor: string;
  hairColor: string;
}

export interface Biography {
  fullName: string;
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  groupAffiliation: string;
  relatives: string;
}

export interface Images {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface Team {
  id: string;
  name: string;
  members: Superhero[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppContextType {
  superheroes: Superhero[];
  favorites: Superhero[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  addToFavorites: (superhero: Superhero) => void;
  removeFromFavorites: (superheroId: number) => void;
  createTeam: (name: string) => Promise<string>;
  addMemberToTeam: (teamId: string, superhero: Superhero) => Promise<void>;
  removeMemberFromTeam: (teamId: string, superheroId: number) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  refreshSuperheroes: () => Promise<void>;
}

export type RootStackParamList = {
  Main: undefined;
  SuperheroDetail: { superhero: any };
  SearchSuperhero: { teamId: string; teamName: string };
  AddMember: { teamId: string; teamName: string };
};

export type MainTabParamList = {
  Superheroes: undefined;
  Favorites: undefined;
  Teams: undefined;
};
