import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const input = join(root, 'public', 'logo.png')
const outDir = join(root, 'public')

const sizes = [64, 192, 512]

async function generate() {
  for (const size of sizes) {
    await sharp(input)
      .resize(size, size)
      .png()
      .toFile(join(outDir, `pwa-${size}x${size}.png`))
    console.log(`✅ pwa-${size}x${size}.png`)
  }

  // Maskable icon (com padding para safe zone)
  await sharp(input)
    .resize(512, 512)
    .extend({
      top: 51, bottom: 51, left: 51, right: 51,
      background: { r: 11, g: 26, b: 46, alpha: 1 } // #0B1A2E
    })
    .resize(512, 512)
    .png()
    .toFile(join(outDir, 'pwa-maskable-512x512.png'))
  console.log('✅ pwa-maskable-512x512.png')

  // Apple touch icon (180x180 com fundo)
  await sharp(input)
    .resize(160, 160)
    .extend({
      top: 10, bottom: 10, left: 10, right: 10,
      background: { r: 11, g: 26, b: 46, alpha: 1 }
    })
    .resize(180, 180)
    .png()
    .toFile(join(outDir, 'apple-touch-icon.png'))
  console.log('✅ apple-touch-icon.png')

  // Favicon 32x32
  await sharp(input)
    .resize(32, 32)
    .png()
    .toFile(join(outDir, 'favicon-32x32.png'))
  console.log('✅ favicon-32x32.png')

  console.log('\n🎉 Todos os ícones gerados!')
}

generate().catch(console.error)
