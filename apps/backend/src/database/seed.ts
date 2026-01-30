import db from './db';
import { hashPassword } from '../utils/password';

export const seedIfEmpty = () => {
  const categoryCount = (db.prepare('SELECT count(*) as count FROM categories').get() as { count: number }).count;
  if (categoryCount > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding database...');

  // 1. Categories
  const categories = [
    { name: 'Grills', nameAr: 'المشاوي', displayOrder: 1 },
    { name: 'Burgers', nameAr: 'البرغر', displayOrder: 2 },
    { name: 'Pizza', nameAr: 'البيتزا', displayOrder: 3 },
    { name: 'Appetizers', nameAr: 'المقبلات', displayOrder: 4 },
    { name: 'Desserts', nameAr: 'الحلويات', displayOrder: 5 },
    { name: 'Beverages', nameAr: 'المشروبات', displayOrder: 6 },
  ];

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, nameAr, displayOrder) VALUES (?, ?, ?)'
  );

  categories.forEach((cat) => insertCategory.run(cat.name, cat.nameAr, cat.displayOrder));
  console.log('Categories inserted.');

  // 2. Modifiers
  const modifiers = [
    { name: 'Add Fries', nameAr: 'إضافة بطاطا', price: 1.25, type: 'addon' },
    { name: 'Add Drink', nameAr: 'إضافة مشروب', price: 1.75, type: 'addon' },
    { name: 'Extra Cheese', nameAr: 'جبنة إضافية', price: 0.50, type: 'addon' },
    { name: 'No Onion', nameAr: 'بدون بصل', price: 0.00, type: 'option' },
    { name: 'No Sauce', nameAr: 'بدون صوص', price: 0.00, type: 'option' },
    { name: 'Spicy', nameAr: 'حار', price: 0.00, type: 'option' },
  ];

  const insertModifier = db.prepare(
    'INSERT INTO modifiers (name, nameAr, price, type) VALUES (?, ?, ?, ?)'
  );

  modifiers.forEach((mod) => insertModifier.run(mod.name, mod.nameAr, mod.price, mod.type));
  console.log('Modifiers inserted.');

  // Helper to get ID
  const getCatId = (name: string) => db.prepare('SELECT id FROM categories WHERE name = ?').get(name) as { id: number };
  const getModId = (name: string) => db.prepare('SELECT id FROM modifiers WHERE name = ?').get(name) as { id: number };

  // 3. Products
  const products = [
    // Grills - المشاوي
    { category: 'Grills', name: 'Lamb Kebab', nameAr: 'كباب لحم', price: 8.50 },
    { category: 'Grills', name: 'Chicken Kebab', nameAr: 'كباب دجاج', price: 6.50 },
    { category: 'Grills', name: 'Shish Tawook', nameAr: 'شيش طاووق', price: 6.50 },
    { category: 'Grills', name: 'Lamb Ribs', nameAr: 'ريش غنم', price: 11.50 },
    { category: 'Grills', name: 'Mixed Grill Small', nameAr: 'مشاوي مشكلة صغير', price: 8.00 },
    { category: 'Grills', name: 'Mixed Grill Medium', nameAr: 'مشاوي مشكلة وسط', price: 15.00 },
    { category: 'Grills', name: 'Mixed Grill Large', nameAr: 'مشاوي مشكلة كبير', price: 22.00 },
    { category: 'Grills', name: 'Kofta Tahini', nameAr: 'كفتة طحينة', price: 7.50 },
    { category: 'Grills', name: 'Lamb Skewers', nameAr: 'أوصال لحم', price: 9.00 },
    { category: 'Grills', name: 'Chicken Skewers', nameAr: 'أوصال دجاج', price: 6.00 },
    { category: 'Grills', name: 'Grilled Breast', nameAr: 'صدر مشوي', price: 5.50 },
    { category: 'Grills', name: 'Wings', nameAr: 'جناحات', price: 4.50 },

    // Burgers - البرغر
    { category: 'Burgers', name: 'Classic Beef', nameAr: 'كلاسيك لحم', price: 3.50 },
    { category: 'Burgers', name: 'Chicken', nameAr: 'دجاج', price: 3.00 },
    { category: 'Burgers', name: 'Crispy', nameAr: 'كرسبي', price: 3.75 },
    { category: 'Burgers', name: 'Double Beef', nameAr: 'دوبل لحم', price: 5.25 },
    { category: 'Burgers', name: 'Cheese', nameAr: 'تشيز', price: 3.75 },
    { category: 'Burgers', name: 'Mushroom', nameAr: 'مشروم', price: 4.25 },
    { category: 'Burgers', name: 'Bacon', nameAr: 'بيكون', price: 4.75 },
    { category: 'Burgers', name: 'Spicy', nameAr: 'سبايسي', price: 3.75 },
    { category: 'Burgers', name: 'Mix', nameAr: 'ميكس', price: 5.50 },
    { category: 'Burgers', name: 'Kids', nameAr: 'أطفال', price: 2.50 },

    // Pizza - البيتزا
    { category: 'Pizza', name: 'Margherita', nameAr: 'مارجريتا', price: 4.00 },
    { category: 'Pizza', name: 'Vegetable', nameAr: 'خضار', price: 5.00 },
    { category: 'Pizza', name: 'Salami', nameAr: 'سلامي', price: 5.50 },
    { category: 'Pizza', name: 'Pepperoni', nameAr: 'بيبروني', price: 5.75 },
    { category: 'Pizza', name: 'Chicken', nameAr: 'دجاج', price: 6.00 },
    { category: 'Pizza', name: 'Beef', nameAr: 'لحم', price: 6.50 },
    { category: 'Pizza', name: 'Tuna', nameAr: 'تونة', price: 6.00 },
    { category: 'Pizza', name: 'Mixed', nameAr: 'مشكلة', price: 6.50 },
    { category: 'Pizza', name: 'Cheese', nameAr: 'جبنة', price: 4.50 },
    { category: 'Pizza', name: 'Mushroom', nameAr: 'فطر', price: 5.00 },
    { category: 'Pizza', name: 'Spicy', nameAr: 'سبايسي', price: 5.25 },
    { category: 'Pizza', name: 'Family Size', nameAr: 'عائلية', price: 11.00 },

    // Appetizers - المقبلات
    { category: 'Appetizers', name: 'French Fries', nameAr: 'بطاطا مقلية', price: 1.50 },
    { category: 'Appetizers', name: 'Wedges', nameAr: 'ودجز', price: 2.00 },
    { category: 'Appetizers', name: 'Cheese Fries', nameAr: 'بطاطا بالجبنة', price: 2.50 },
    { category: 'Appetizers', name: 'Mozzarella Sticks', nameAr: 'موزاريلا', price: 3.25 },
    { category: 'Appetizers', name: 'Onion Rings', nameAr: 'حلقات بصل', price: 2.00 },
    { category: 'Appetizers', name: 'Nuggets', nameAr: 'ناجتس', price: 3.00 },
    { category: 'Appetizers', name: 'Spring Rolls', nameAr: 'سبرنغ رول', price: 2.50 },
    { category: 'Appetizers', name: 'Cheese Sambousek', nameAr: 'سمبوسك جبنة', price: 2.25 },
    { category: 'Appetizers', name: 'Meat Sambousek', nameAr: 'سمبوسك لحم', price: 2.75 },
    { category: 'Appetizers', name: 'Falafel', nameAr: 'فلافل', price: 1.50 },
    { category: 'Appetizers', name: 'Fried Kibbeh', nameAr: 'كبة مقلية', price: 0.75 },
    { category: 'Appetizers', name: 'Grilled Kibbeh', nameAr: 'كبة مشوية', price: 1.25 },

    // Desserts - الحلويات
    { category: 'Desserts', name: 'Kunafa Soft', nameAr: 'كنافة ناعمة', price: 2.50 },
    { category: 'Desserts', name: 'Kunafa Crispy', nameAr: 'كنافة خشنة', price: 2.50 },
    { category: 'Desserts', name: 'Baklava', nameAr: 'بقلاوة', price: 3.00 },
    { category: 'Desserts', name: 'Zainab Fingers', nameAr: 'أصابع زينب', price: 1.50 },
    { category: 'Desserts', name: 'Qatayef', nameAr: 'قطايف', price: 0.60 },
    { category: 'Desserts', name: 'Cheesecake', nameAr: 'تشيز كيك', price: 3.50 },
    { category: 'Desserts', name: 'Chocolate Cake', nameAr: 'كيكة شوكولاتة', price: 3.00 },
    { category: 'Desserts', name: 'Vanilla Cake', nameAr: 'كيكة فانيلا', price: 2.50 },
    { category: 'Desserts', name: 'Creme Caramel', nameAr: 'كريم كراميل', price: 2.00 },
    { category: 'Desserts', name: 'Mahalabia', nameAr: 'مهلبية', price: 1.50 },
    { category: 'Desserts', name: 'Rice Pudding', nameAr: 'رز بحليب', price: 1.50 },
    { category: 'Desserts', name: 'Ice Cream', nameAr: 'آيس كريم', price: 1.75 },

    // Beverages - المشروبات
    { category: 'Beverages', name: 'Pepsi', nameAr: 'بيبسي', price: 0.55 },
    { category: 'Beverages', name: 'Coca Cola', nameAr: 'كوكا كولا', price: 0.55 },
    { category: 'Beverages', name: 'Water', nameAr: 'ماء', price: 0.30 },
    { category: 'Beverages', name: 'Orange Juice', nameAr: 'عصير برتقال', price: 1.00 },
    { category: 'Beverages', name: 'Arabic Coffee', nameAr: 'قهوة عربية', price: 0.75 },
    { category: 'Beverages', name: 'Tea', nameAr: 'شاي', price: 0.50 },
  ];

  const insertProduct = db.prepare(
    'INSERT INTO products (categoryId, name, nameAr, price, displayOrder) VALUES (?, ?, ?, ?, ?)'
  );

  const insertProductModifier = db.prepare(
    'INSERT INTO product_modifiers (productId, modifierId) VALUES (?, ?)'
  );

  let displayOrder = 1;
  products.forEach((prod) => {
    const catId = getCatId(prod.category).id;
    const info = insertProduct.run(catId, prod.name, prod.nameAr, prod.price, displayOrder++);
    const prodId = info.lastInsertRowid as number;

    // Link Modifiers
    if (prod.category === 'Burgers') {
      const mods = ['Add Fries', 'Add Drink', 'Extra Cheese', 'No Onion', 'No Sauce', 'Spicy'];
      mods.forEach((m) => insertProductModifier.run(prodId, getModId(m).id));
    } else if (prod.category === 'Pizza') {
      const mods = ['Extra Cheese', 'Spicy'];
      mods.forEach((m) => insertProductModifier.run(prodId, getModId(m).id));
    }
  });

  console.log('Products and ProductModifiers inserted.');

  // Check if users need seeding (though migrate.ts handles admin)
  const userCount = (db.prepare('SELECT count(*) as count FROM users').get() as { count: number }).count;
  if (userCount < 2) {
    const cashier = hashPassword('cashier123');
    db.prepare(`
        INSERT OR IGNORE INTO users (username, name, role, passwordHash, passwordSalt, isActive)
        VALUES (?, ?, ?, ?, ?, 1)
      `).run('cashier', 'Cashier', 'cashier', cashier.hash, cashier.salt);
    console.log('Cashier user inserted.');
  }

  console.log('Seeding complete!');
};
