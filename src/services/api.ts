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
    return 0;
  }
}

export const apiService = new ApiService();
