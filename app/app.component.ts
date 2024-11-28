import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';  



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, TitleCasePipe, FormsModule],  
  template: `
    <div class="container">
      <div class="pokemon-list-container">
        <div class="search-container">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="filterPokemons()" 
            placeholder="Search" 
            class="search-input" />
        </div>

        <ul>
          <li *ngFor="let pokemon of filteredPokemons" (click)="fetchPokemonDetails(pokemon.url)">
            {{ pokemon.name | titlecase }}
          </li>
        </ul>
      </div>

      <div class="pokemon-details-container" *ngIf="selectedPokemon">
        <h2>{{ selectedPokemon.name | titlecase }}</h2>

        <div class="pokemon-icon">
          <img [src]="selectedPokemon.sprites?.front_default" alt="{{ selectedPokemon.name }}" />
        </div>

        <div class="pokemon-info">
          <div class="info-flex">
            <div class="info-left">
              <div class="info-item-h-w">
                <span class="info-label">Height</span>
                <span class="info-value">{{ selectedPokemon.height }} m</span>
              </div>
              <div class="info-item-h-w">
                <span class="info-label">Weight</span>
                <span class="info-value">{{ selectedPokemon.weight }} kg</span>
              </div>
            </div>

            <div class="info-right">
              <div class="info-item">
                <span class="info-label">Abilities</span>
                <ul>
                  <li *ngFor="let ability of selectedPokemon.abilities">
                    <span class="info-value">{{ ability.ability.name | titlecase }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [

    `
    * {
  font-family: 'Roboto Flex';
}
      .container {
        display: flex;
        gap: 20px;
        height: 100vh;
        padding: 20px;
      }

      li {
  padding: 4px 0;
  font-weight: 300;
  font-size: 16px;
  color: #000000;
  cursor: pointer; 
  transition: all 0.3s ease; 
}

li:hover {
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #005DCD; 
}





      .pokemon-list-container {
        width: 15%;
        padding: 20px;
        background-color: #f9f9f9;
        height: 100%;
        overflow-y: auto;
      }

      .search-container {
        margin-bottom: 20px;
      }

      .search-input {
        width: 90%;
        padding: 8px;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      .pokemon-details-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 350px;
        height: 350px;
        padding: 20px;
        border-radius: 15px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
      }

      .pokemon-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        align-items: center;
      }

      h2 {
        margin: 0;
        text-align: center;
      }

      .pokemon-icon {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pokemon-icon img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .info-flex {
        display: flow;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 20px;
      }

      .info-left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 48%;
      }

      .info-right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 48%;
      }

      .info-item {
        margin: 8px 0;
        text-align: left;
        width: 100%;
        margin-bottom: 20px;
      }
      .info-item-h-w {
        display: contents;
        margin: 8px 0;
        text-align: left;
        width: 100%;
        margin-bottom: 10px;
      }

      ul {
        padding: 0;
        list-style-type: none;
        margin: 0;
      }

      li {
        padding: 4px 0;
      }

      .info-label {
        font-family: 'Inter', sans-serif;
        font-weight: 300;
        font-size: 12px;
        text-transform: uppercase;
        color: #000000;
      }

      .info-value {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        color: #000000;
        text-transform: uppercase;
        margin-top: 7px;
      }
    

  
    @media (max-width: 480px) {
    .pokemon-list-container {
      width: auto;
      padding: 10px;
    }

    .search-input{
      width: 80%;
      font-size: 10px;
    }


  .pokemon-details-container {
    width: 100%;
    padding: 10px;
  }

  .search-input {
    font-size: 12px;
  }

  li {
    font-size: 14px;
  }

  .info-label {
    font-size: 10px;
  }

  .info-value {
    font-size: 12px;
  }
}
    `,
  ],

  
})
export class AppComponent {
  pokemons: any[] = [];
  selectedPokemon: any | null = null;
  searchQuery: string = '';
  filteredPokemons: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=151')
      .subscribe((response) => {
        this.pokemons = response.results;
        this.filteredPokemons = this.pokemons;
      });
  }

  fetchPokemonDetails(url: string) {
    this.http.get<any>(url).subscribe(
      (response) => {
        this.selectedPokemon = response;
      },
      (error) => {
        console.error('Error fetching Pokémon details:', error);
      }
    );
  }

  filterPokemons() {
    if (this.searchQuery.trim() === '') {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    }
  }

  clearSelection() {
    this.selectedPokemon = null;
  }
}
