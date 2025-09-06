import { Superhero } from "../types";

const API_BASE_URL = "https://akabab.github.io/superhero-api/api";

class ApiService {
  async getAllSuperheroes(): Promise<Superhero[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/all.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((hero: any) => this.transformSuperhero(hero));
    } catch (error) {
      console.error("Error fetching superheroes:", error);
      throw new Error("Failed to fetch superheroes");
    }
  }

  private transformSuperhero(hero: any): Superhero {
    return {
      id: hero.id,
      name: hero.name,
      slug: hero.slug,
      realName: hero.biography?.fullName || "",
      powerstats: hero.powerstats,
      appearance: hero.appearance,
      biography: hero.biography,
      work: hero.work,
      connections: hero.connections,
      images: hero.images,
      powerScore: this.calculatePowerScore(hero.powerstats),
      isFavorite: false,
    };
  }

  private calculatePowerScore(powerstats: any): number {
    const stats = {
      intelligence: parseInt(powerstats.intelligence) || 0,
      strength: parseInt(powerstats.strength) || 0,
      speed: parseInt(powerstats.speed) || 0,
      durability: parseInt(powerstats.durability) || 0,
      power: parseInt(powerstats.power) || 0,
      combat: parseInt(powerstats.combat) || 0,
    };

    const weights = {
      intelligence: 0.15,
      strength: 0.2,
      speed: 0.15,
      durability: 0.2,
      power: 0.2,
      combat: 0.1,
    };

    const weightedScore =
      stats.intelligence * weights.intelligence +
      stats.strength * weights.strength +
      stats.speed * weights.speed +
      stats.durability * weights.durability +
      stats.power * weights.power +
      stats.combat * weights.combat;

    return Math.min(100, Math.max(0, Math.round(weightedScore * 100) / 100));
  }
}

export const apiService = new ApiService();
