import * as SQLite from "expo-sqlite";
import { Superhero, Team } from "../types";

const DB_NAME = "superheroes.db";

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS superheroes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        realName TEXT,
        powerstats TEXT NOT NULL,
        appearance TEXT NOT NULL,
        biography TEXT NOT NULL,
        work TEXT NOT NULL,
        connections TEXT NOT NULL,
        images TEXT NOT NULL,
        powerScore REAL,
        isFavorite INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_superheroes_name ON superheroes(name);
    `);
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_superheroes_realname ON superheroes(realName);
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS team_members (
        teamId TEXT NOT NULL,
        superheroId INTEGER NOT NULL,
        addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (teamId, superheroId),
        FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (superheroId) REFERENCES superheroes(id) ON DELETE CASCADE
      );
    `);
  }

  async saveSuperheroes(superheroes: Superhero[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    for (const hero of superheroes) {
      const realName = hero.biography?.fullName || "";

      await this.db.runAsync(
        `INSERT OR REPLACE INTO superheroes 
         (id, name, slug, realName, powerstats, appearance, biography, work, connections, images, powerScore, isFavorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hero.id,
          hero.name,
          hero.slug,
          realName,
          JSON.stringify(hero.powerstats),
          JSON.stringify(hero.appearance),
          JSON.stringify(hero.biography),
          JSON.stringify(hero.work),
          JSON.stringify(hero.connections),
          JSON.stringify(hero.images),
          hero.powerScore || 0,
          hero.isFavorite ? 1 : 0,
        ]
      );
    }
  }

  async getAllSuperheroes(): Promise<Superhero[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(`
      SELECT * FROM superheroes ORDER BY name
    `);

    return result.map((row: any) => ({
      ...row,
      realName: row.realName || "",
      powerstats: JSON.parse(row.powerstats),
      appearance: JSON.parse(row.appearance),
      biography: JSON.parse(row.biography),
      work: JSON.parse(row.work),
      connections: JSON.parse(row.connections),
      images: JSON.parse(row.images),
      isFavorite: Boolean(row.isFavorite),
    }));
  }

  async searchSuperheroes(query: string): Promise<Superhero[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      `
      SELECT * FROM superheroes 
      WHERE name LIKE ? 
         OR realName LIKE ?
      ORDER BY name
    `,
      [`%${query}%`, `%${query}%`]
    );

    return result.map((row: any) => ({
      ...row,
      realName: row.realName || "",
      powerstats: JSON.parse(row.powerstats),
      appearance: JSON.parse(row.appearance),
      biography: JSON.parse(row.biography),
      work: JSON.parse(row.work),
      connections: JSON.parse(row.connections),
      images: JSON.parse(row.images),
      isFavorite: Boolean(row.isFavorite),
    }));
  }

  async getFavorites(): Promise<Superhero[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(`
      SELECT * FROM superheroes WHERE isFavorite = 1 ORDER BY name
    `);

    return result.map((row: any) => ({
      ...row,
      realName: row.realName || "",
      powerstats: JSON.parse(row.powerstats),
      appearance: JSON.parse(row.appearance),
      biography: JSON.parse(row.biography),
      work: JSON.parse(row.work),
      connections: JSON.parse(row.connections),
      images: JSON.parse(row.images),
      isFavorite: Boolean(row.isFavorite),
    }));
  }

  async toggleFavorite(superheroId: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      UPDATE superheroes 
      SET isFavorite = NOT isFavorite, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [superheroId]
    );
  }

  async createTeam(team: Team): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      INSERT INTO teams (id, name) VALUES (?, ?)
    `,
      [team.id, team.name]
    );
  }

  async getAllTeams(): Promise<Team[]> {
    if (!this.db) throw new Error("Database not initialized");

    const teams = await this.db.getAllAsync(`
      SELECT * FROM teams ORDER BY name
    `);

    const teamsWithMembers = await Promise.all(
      teams.map(async (team: any) => {
        const members = await this.getTeamMembers(team.id);
        return {
          ...team,
          members,
        };
      })
    );

    return teamsWithMembers;
  }

  async getTeamMembers(teamId: string): Promise<Superhero[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      `
      SELECT s.* FROM superheroes s
      INNER JOIN team_members tm ON s.id = tm.superheroId
      WHERE tm.teamId = ?
      ORDER BY s.name
    `,
      [teamId]
    );

    return result.map((row: any) => ({
      ...row,
      realName: row.realName || "",
      powerstats: JSON.parse(row.powerstats),
      appearance: JSON.parse(row.appearance),
      biography: JSON.parse(row.biography),
      work: JSON.parse(row.work),
      connections: JSON.parse(row.connections),
      images: JSON.parse(row.images),
      isFavorite: Boolean(row.isFavorite),
    }));
  }

  async addMemberToTeam(teamId: string, superheroId: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      INSERT OR IGNORE INTO team_members (teamId, superheroId) VALUES (?, ?)
    `,
      [teamId, superheroId]
    );
  }

  async removeMemberFromTeam(
    teamId: string,
    superheroId: number
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      DELETE FROM team_members WHERE teamId = ? AND superheroId = ?
    `,
      [teamId, superheroId]
    );
  }

  async deleteTeam(teamId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `
      DELETE FROM teams WHERE id = ?
    `,
      [teamId]
    );
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
