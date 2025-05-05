const { Pool } = require("pg");

// Chỉ load dotenv trong development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL không được định nghĩa!");
}

const isProduction = process.env.NODE_ENV === "production";

let pool;

try {
  if (isProduction) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    console.log("Using production database configuration");
  } else {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });
    console.log("Using development database configuration");
  }
} catch (err) {
  console.error("Lỗi khi khởi tạo pool:", err.stack);
  throw err;
}

pool.on("error", (err, client) => {
  console.error("Lỗi kết nối database:", err.stack);
  process.exit(1); // Thoát ứng dụng nếu có lỗi nghiêm trọng
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Không thể kết nối tới database:", err.stack);
    process.exit(1); // Thoát nếu không kết nối được
  }
  console.log("Kết nối database thành công!");
  release();
});

module.exports = pool;