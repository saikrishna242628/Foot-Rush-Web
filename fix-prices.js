const fs = require('fs');

const files = [
  'frontend/src/pages/ProductDetail.jsx',
  'frontend/src/pages/Cart.jsx',
  'frontend/src/pages/Checkout.jsx',
  'frontend/src/pages/Orders.jsx',
  'frontend/src/pages/Admin.jsx',
  'frontend/src/pages/Wishlist.jsx',
];

const base = 'c:/Users/Sree/OneDrive/Desktop/Foot Rush_final/FooT_RusH/';

files.forEach(rel => {
  const filePath = base + rel;
  let c = fs.readFileSync(filePath, 'utf8');

  // Add import after first import line if not present
  if (!c.includes('formatINR')) {
    c = c.replace(/(import .+\n)/, "$1import { formatINR } from '../utils/currency'\n");
  }

  // Replace: ${x.toFixed(2)} in JSX text nodes  =>  {formatINR(x)}
  // Pattern: >${something.toFixed(2)}<
  c = c.replace(/>\$\{([^}]+)\.toFixed\(2\)\}</g, '>{formatINR($1)}<');

  // Replace: `$${x.toFixed(2)}` template literals  =>  {formatINR(x)}
  c = c.replace(/`\$\$\{([^}]+)\.toFixed\(2\)\}`/g, '{formatINR($1)}');

  // Replace: `Place Order · $${x.toFixed(2)}`  =>  `Place Order · ${formatINR(x)}`
  c = c.replace(/`Place Order · \$\$\{([^}]+)\.toFixed\(2\)\}`/g, '`Place Order · ${formatINR($1)}`');

  // Replace value={`$${x.toFixed(2)}`}  =>  value={formatINR(x)}
  c = c.replace(/value=\{`\$\$\{([^}]+)\.toFixed\(2\)\}`\}/g, 'value={formatINR($1)}');

  // Fix Admin revenue display: `$${x.toFixed(2)}`  =>  formatINR(x)  (inside object)
  c = c.replace(/`\$\$\{(\([^)]+\)[^}]*)\.toFixed\(2\)\}`/g, 'formatINR($1)');

  fs.writeFileSync(filePath, c, 'utf8');
  console.log('Updated:', rel);
});

console.log('\nAll price displays updated to INR!');
