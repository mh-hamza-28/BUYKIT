const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const slugify = (value) =>
  String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const products = [
  ['REAL MADRID', 'images/jersey/r-madrid.png', 899, 'LA LIGA', '2025/26', 'BESTSELLER'],
  ['FC BARCELONA', 'images/jersey/barca.png', 849, 'LA LIGA', '2025/26', 'NEW'],
  ['ATLETICO MADRID 2004/05', 'images/jersey/amadrid2004.png', 799, 'LA LIGA', '2004/05', 'HOT'],
  ['MANCHESTER UNITED', 'images/jersey/manu.png', 899, 'PREMIER LEAGUE', '2025/26', 'NEW'],
  ['ARSENAL FC - 3rd KIT', 'images/jersey/arsenal.png', 949, 'PREMIER LEAGUE', '2025/26', 'BESTSELLER'],
  ['MANCHESTER CITY - AWAY', 'images/jersey/mancity.png', 899, 'PREMIER LEAGUE', '2025/26', 'BESTSELLER'],
  ['AC MILAN - 125th ANNIVERSARY', 'images/jersey/milan125.png', 999, 'SERIE A', '2025/26', 'HOT'],
  ['INTERNAZIONALE MILAN', 'images/jersey/inter.png', 799, 'SERIE A', '2004/05', 'HOT'],
  ['JUVENTUS - AWAY', 'images/jersey/JUVENTUS.png', 749, 'SERIE A', '2020/21', 'HOT'],
  ['FC BAYERN MUNICH - AWAY', 'images/jersey/BAYERN.png', 899, 'BUNDESLIGA', '2025/26', 'NEW'],
  ['BORUSSIA DORTMUND', 'images/jersey/bvb.png', 849, 'BUNDESLIGA', '2025/26', 'NEW'],
  ['LEVERKUSEN', 'images/jersey/lvksen.png', 799, 'BUNDESLIGA', '2025/26', 'NEW'],
  ['INTER MIAMI FC - AWAY', 'images/jersey/miami.png', 999, 'MLS', '2025/26', 'NEW'],
  ['LA GALAXY FC', 'images/jersey/LAGAL.png', 749, 'MLS', '2025/26', 'HOT'],
  ['PHILADELPHIA UNION', 'images/jersey/PHP.png', 699, 'MLS', '2025/26', 'NEW'],
  ['AL NASSR FC', 'images/jersey/alnasr.png', 999, 'SAUDI PRO LEAGUE', '2025/26', 'HOT'],
  ['AL HILAL FC', 'images/jersey/HILAL.png', 899, 'SAUDI PRO LEAGUE', '2025/26', 'BESTSELLER'],
  ['AL ITTIHAD FC', 'images/jersey/ITTI.png', 849, 'SAUDI PRO LEAGUE', '2025/26', 'NEW']
].map(([name, image, price, league, season, badge]) => ({
  name,
  slug: slugify(name),
  image,
  price,
  league,
  season,
  badge,
  stock: 100
}));

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@buykit.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: 'BuyKIT Admin', email: adminEmail, password: adminPassword, role: 'admin' });
  }
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
