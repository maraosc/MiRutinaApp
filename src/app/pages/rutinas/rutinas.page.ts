import { Component, OnInit } from '@angular/core';
import { WgerService } from '../../services/wger.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.page.html',
  styleUrls: ['./rutinas.page.scss'],
  standalone: false,
})
export class RutinasPage implements OnInit {

  rutinas: any[] = [];
  loading = false;

  private muscleMap = new Map<number, string>();
  private categoryMap = new Map<number, string>();

  constructor(private wger: WgerService) {}

ngOnInit(): void {
  this.wger.getRoutines().subscribe({
    next: resp => this.rutinas = resp.results,
    error: err => console.error('Error al cargar rutinas', err)
  });
}


  private loadReferenceData(): void {
    this.loading = true;
    forkJoin({
      muscles:   this.wger.getMuscles(),
      categories:this.wger.getCategories()
    }).subscribe({
      next: ({ muscles, categories }) => {
        muscles.results.forEach((m: any) => this.muscleMap.set(m.id, m.name));
        categories.results.forEach((c: any) => this.categoryMap.set(c.id, c.name));
        this.loadRutinas();
      },
      error: () => this.loading = false
    });
  }

  private loadRutinas(page: number = 1): void {
    this.wger.getExercises(page).subscribe({
      next: resp => {
        this.rutinas = resp.results.map((ex: any) => ({
          ...ex,
          muscles: ex.muscles?.map((id: number) => ({ id, name: this.muscleMap.get(id) })),
          category: ex.category != null
            ? { id: ex.category, name: this.categoryMap.get(ex.category) }
            : null
        }));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  /** Devuelve los nombres de los músculos como cadena */
  getMuscleNames(muscles: { name: string }[]): string {
    return muscles?.map(m => m.name).join(', ') ?? '';
  }

  /** Devuelve el nombre de la categoría o un guión */
  getCategoryName(cat: { name: string } | null): string {
    return cat?.name ?? '—';
  }
}
