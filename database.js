import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabaseSync('safeDrive.db');


export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS ocorrencias (
      id TEXT PRIMARY KEY NOT NULL,
      comentario TEXT,
      latitude REAL,
      longitude REAL
    );
  `);
}


export function insertOcorrencia(o) {
  db.runSync(
    `INSERT INTO ocorrencias (id, comentario, latitude, longitude)
     VALUES (?, ?, ?, ?)`,
    [o.id, o.comentario, o.latitude, o.longitude]
  );
}

export function getOcorrencias(setter) {
  const result = db.getAllSync(
    `SELECT * FROM ocorrencias ORDER BY rowid DESC`
  );

  setter(result);
}

export function deleteOcorrencia(id) {
  db.runSync(
    `DELETE FROM ocorrencias WHERE id = ?`,
    [id]
  );
}