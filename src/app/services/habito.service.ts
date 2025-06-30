import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class HabitoService {
  private dbInstance: SQLiteObject | null = null;

  constructor(
    private sqlite: SQLite,
    private authService: AuthServiceService
  ) {}

  // Inicializar conexión y crear tabla
async init() {
  try {
    this.dbInstance = this.authService.dbInstance; // 🔄 usar la misma conexión ya abierta
    if (!this.dbInstance) {
      throw new Error('Base de datos no inicializada en AuthService');
    }
    await this.createTableHabitos();
  } catch (err) {
    console.error('Error inicializando DB en HabitoService:', err);
  }
}

  // Crear tabla de hábitos
  private async createTableHabitos() {
    if (!this.dbInstance) return;

    const query = `
      CREATE TABLE IF NOT EXISTS habitos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        completado INTEGER,
        imagen TEXT,
        fecha TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    await this.dbInstance.executeSql(query, []);
  }

  // Guardar hábito
  async guardarHabito(
  habito: { nombre: string; completado: boolean; imagen: string },
  userId: number,
  fecha: string
) {
  if (!this.dbInstance) return;

  const completado = habito.completado ? 1 : 0;

  const sql = `
    INSERT INTO habitos (nombre, completado, imagen, fecha, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  await this.dbInstance.executeSql(sql, [
    habito.nombre,
    completado,
    habito.imagen,
    fecha,
    userId
  ]);
}

  // Obtener hábitos por fecha y usuario
async obtenerHabitosPorFecha(fecha: string, userId: number): Promise<any[]> {
  if (!this.dbInstance) return [];

  const sql = `SELECT * FROM habitos WHERE fecha = ? AND user_id = ?`;
  const res = await this.dbInstance.executeSql(sql, [fecha, userId]);

  const resultados: any[] = [];
  for (let i = 0; i < res.rows.length; i++) {
    resultados.push(res.rows.item(i));
  }
  return resultados;
}


// Actualizar estado (completado = 1 o 0)
async actualizarEstadoHabito(id: number, completado: number) {
  if (!this.dbInstance) return;
  const sql = `UPDATE habitos SET completado = ? WHERE id = ?`;
  await this.dbInstance.executeSql(sql, [completado, id]);
}

async eliminarHabito(id: number) {
  if (!this.dbInstance) return;
  const sql = `DELETE FROM habitos WHERE id = ?`;
  await this.dbInstance.executeSql(sql, [id]);
}

}
