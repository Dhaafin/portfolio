import { hashPassword } from "../src/lib/auth.js";

const password = process.argv[2];
const secretKey = process.argv[3];

if (!password || !secretKey) {
  console.log("Usage: node scratch/hash-password.js <password> <secretKey>");
  process.exit(1);
}

hashPassword(password, secretKey).then((hash) => {
  console.log("\n🔑 Hash generated successfully!");
  console.log("-----------------------------------------");
  console.log(`ADMIN_USERNAME="dhaafinm@gmail.com"`);
  console.log(`ADMIN_SECRET_KEY="${secretKey}"`);
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log("-----------------------------------------\n");
  console.log("Copy-paste these lines directly to your .env.local file.");
});
