const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Change provider
schema = schema.replace('provider = "mysql"', 'provider = "sqlite"');

// 2. Remove @db.Decimal(15, 2)
schema = schema.replace(/@db\.Decimal\(15, 2\)/g, '');

// 3. Remove @db.Text
schema = schema.replace(/@db\.Text/g, '');

// 4. Change Json to String
schema = schema.replace(/data\s+Json\?/g, 'data      String?');

// 5. Replace Enum usages in models with String
const enums = ['AccountType', 'CategoryType', 'TransactionType', 'Frequency', 'NotificationType'];
enums.forEach(e => {
  // Replace the enum definition with a comment
  const enumRegex = new RegExp(`enum ${e} \\{[^}]+\\}`, 'g');
  schema = schema.replace(enumRegex, `// Enum ${e} removed for SQLite compatibility\n// Values were in original schema`);
  
  // Replace the field types (e.g. `type AccountType`) with `String`
  const fieldRegex = new RegExp(`(\\w+)\\s+${e}(\\?)?`, 'g');
  schema = schema.replace(fieldRegex, `$1 String$2`);
});

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated for SQLite');
