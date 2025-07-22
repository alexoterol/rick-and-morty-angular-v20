import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {

  // Inyección del servicio
  private api = inject(Api);

  // Señal pública conectada desde el servicio
  public characters = this.api.characters;

  // Estado de la UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // Señal computada para saber si hay personajes cargados
  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getCharacters().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        // No es necesario actualizar characters, ya lo hace el servicio
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los personajes. Intenta nuevamente.';
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.searchCharacters(this.searchTerm).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        // El servicio actualiza automáticamente los datos
      },
      error: (err) => {
        this.errorMessage = 'No se encontraron personajes con ese nombre.';
        console.error(err);
      }
    });
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
