import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public dbInstance!: SQLiteObject;
  private userId: number = 0; // ✅ Aquí se guarda el ID del usuario logueado

  constructor(private sqlite: SQLite) { 
    this.initializeDatabase();
  }

  async initializeDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'auth.db',
      location: 'default' 
    });
    await this.createTables();
  }

  async createTables() {
    await this.dbInstance.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        fecha_nacimiento date,
        objetivo_principal TEXT
      )
    `, []);
  }

  async registerUser(
    nombre: string,
    email: string,
    password: string,
    fechaNacimiento: string,
    objetivoPrincipal: string
  ): Promise<boolean> {
    try {
      const sql = `
        INSERT INTO users (nombre, email, password, fecha_nacimiento, objetivo_principal)
        VALUES (?, ?, ?, ?, ?)
      `;
      await this.dbInstance.executeSql(sql, [nombre, email, password, fechaNacimiento, objetivoPrincipal]);
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const sql = `
        SELECT * FROM users WHERE email = ? AND password = ?
      `;
      const result = await this.dbInstance.executeSql(sql, [email, password]);
      if (result.rows.length > 0) {
        const user = result.rows.item(0);
        this.userId = user.id; // Guardar el ID del usuario logueado
        return user;
      } else {
        throw new Error('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const result = await this.dbInstance.executeSql(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async getUserIdByEmail(email: string): Promise<number | null> {
    try {
      const result = await this.dbInstance.executeSql(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (result.rows.length > 0) {
        return result.rows.item(0).id;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener user_id:', error);
      return null;
    }
  }

  // Método correcto para acceder al ID del usuario logueado
  getUserId(): number {
    return this.userId;
  }

  // Reset de sesión
  logout() {
    this.userId = 0;
    this.dbInstance = null!;
  }
}
