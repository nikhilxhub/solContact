import * as SQLite from 'expo-sqlite';

export const DATABASE_NAME = 'contacts.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDBConnection() {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME, { useNewConnection: true });
    }
    return dbInstance;
}

export async function createTable() {
    const db = await getDBConnection();
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            phoneNumber TEXT,
            walletAddress TEXT,
            skrAddress TEXT,
            avatarUri TEXT,
            notes TEXT,
            addedVia TEXT,
            createdAt INTEGER,
            updatedAt INTEGER
        );
    `);

    // Migration helper to ensure columns exist (idempotent-ish for dev)
    const addColumn = async (columnDefinition: string) => {
        try {
            await db.execAsync(`ALTER TABLE contacts ADD COLUMN ${columnDefinition}`);
        } catch (e: any) {
            // Ignore error if column already exists
            if (!e.message.includes('duplicate column name')) {
                console.log(`Migration validation: ${e.message}`);
            }
        }
    };

    await addColumn('phoneNumber TEXT');
    await addColumn('walletAddress TEXT');
    await addColumn('skrAddress TEXT');
    await addColumn('avatarUri TEXT');
    await addColumn('notes TEXT');
}
