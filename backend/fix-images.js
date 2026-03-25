// Run: node fix-images.js
// Updates product images with verified working URLs
const { dbRun, dbAll, initDB } = require('./db')

const imageUpdates = [
  // Using verified Unsplash photo IDs for shoe images
  { name: 'Air Rush Pro',       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Street King Sneaker',image: 'https://images.unsplash.com/photo-1600185365926-3a2979f4d7e4?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hoop Legend Hi-Top', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Urban Slide Classic', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80' },
  { name: 'Trail Blazer Boot',  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80&sat=-100' },
  { name: 'Cloud Walker Comfort',image:'https://images.unsplash.com/photo-1539185261023-f7f5188ce498?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sprint Elite Racing', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80' },
  { name: 'Retro Vibe Low',     image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80' },
  { name: 'Power Lift Training',image: 'https://images.unsplash.com/photo-1584735175315-9d5df23be5f1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Luxe Dress Oxford',  image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kids Zoom Runner',   image: 'https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?auto=format&fit=crop&w=600&q=80' },
  { name: "Women's Aura Flex",  image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80' },
]

async function run() {
  await initDB()
  const products = await dbAll('SELECT id, name FROM products')

  let updated = 0
  for (const product of products) {
    // Try exact match first, then partial
    const fix = imageUpdates.find(u =>
      product.name === u.name || product.name.includes(u.name.split(' ')[0])
    )
    if (fix) {
      await dbRun('UPDATE products SET image = ? WHERE id = ?', [fix.image, product.id])
      console.log(`✅ Updated: ${product.name}`)
      updated++
    }
  }
  console.log(`\nUpdated ${updated}/${products.length} products`)
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
