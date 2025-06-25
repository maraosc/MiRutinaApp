import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public dbInstance!: SQLiteObject;

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

// Crear tabla con los nuevos campos
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

// Método para registrar un nuevo usuario con retorno booleano
async registerUser(
  nombre: string,
  email: string,
  password: string,
  fechaNacimiento: string,
  objetivoPrincipal: string
): Promise<boolean> {
  try {
    console.log('Intentando registrar usuario:', { nombre, email, password, fechaNacimiento, objetivoPrincipal });

    const sql = `
      INSERT INTO users (nombre, email, password, fecha_nacimiento, objetivo_principal)
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.dbInstance.executeSql(sql, [nombre, email, password, fechaNacimiento, objetivoPrincipal]);

    console.log('Usuario registrado con éxito');
    return true;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return false;
  }
}

  // Método login usuario
async loginUser(email: string, password: string): Promise<any> {
  try {
    const sql = `
      SELECT * FROM users WHERE email = ? AND password = ?
    `;
    const result = await this.dbInstance.executeSql(sql, [email, password]);
    if (result.rows.length > 0) {
      return result.rows.item(0); // ✅ solo retorna los datos del usuario
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}


  // Método para obtener un usuario por email
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
  
}
