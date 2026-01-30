import db from './db';
import { hashPassword } from '../utils/password';

const migrations = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nameAr TEXT NOT NULL,
    displayOrder INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryId INTEGER NOT NULL,
    name TEXT NOT NULL,
    nameAr TEXT NOT NULL,
    price REAL NOT NULL,
    isActive INTEGER DEFAULT 1,
    displayOrder INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS modifiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nameAr TEXT NOT NULL,
    price REAL DEFAULT 0,
    type TEXT CHECK(type IN ('addon', 'option')) DEFAULT 'addon',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_modifiers (
    productId INTEGER NOT NULL,
    modifierId INTEGER NOT NULL,
    PRIMARY KEY (productId, modifierId),
    FOREIGN KEY (productId) REFERENCES products(id),
    FOREIGN KEY (modifierId) REFERENCES modifiers(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderNumber TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('takeaway', 'delivery', 'dinein')) DEFAULT 'takeaway',
    status TEXT CHECK(status IN ('draft', 'kitchen', 'completed', 'cancelled')) DEFAULT 'draft',
    notes TEXT,
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    paidAt TEXT,
    sentToKitchenAt TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS order_item_modifiers (
    orderItemId INTEGER NOT NULL,
    modifierId INTEGER NOT NULL,
    price REAL NOT NULL,
    PRIMARY KEY (orderItemId, modifierId),
    FOREIGN KEY (orderItemId) REFERENCES order_items(id),
    FOREIGN KEY (modifierId) REFERENCES modifiers(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    method TEXT CHECK(method IN ('cash', 'card', 'split')) NOT NULL,
    cashAmount REAL DEFAULT 0,
    cardAmount REAL DEFAULT 0,
    total REAL NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'manager', 'cashier')) NOT NULL,
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    lastUsedAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT NOT NULL,
    entity TEXT,
    entityId INTEGER,
    metadata TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`;

try {
  console.log('Running migrations...');
  db.exec(migrations);
  const orderColumns = db.prepare(`PRAGMA table_info(orders)`).all() as { name: string }[];
  const orderColumnSet = new Set(orderColumns.map((col) => col.name));
  const addColumn = (name: string, sqlType: string, defaultValue?: string) => {
    if (!orderColumnSet.has(name)) {
      const clause = defaultValue ? ` DEFAULT ${defaultValue}` : '';
      db.exec(`ALTER TABLE orders ADD COLUMN ${name} ${sqlType}${clause}`);
    }
  };
  addColumn('tableNumber', 'TEXT');
  addColumn('customerName', 'TEXT');
  addColumn('customerPhone', 'TEXT');
  addColumn('deliveryAddress', 'TEXT');
  addColumn('deliveryFee', 'REAL', '0');
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin') as { id: number } | undefined;
  if (!existing) {
    const { hash, salt } = hashPassword('admin123');
    db.prepare(`
      INSERT INTO users (username, name, role, passwordHash, passwordSalt, isActive)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run('admin', 'Administrator', 'admin', hash, salt);
  }
  console.log('Migrations completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
