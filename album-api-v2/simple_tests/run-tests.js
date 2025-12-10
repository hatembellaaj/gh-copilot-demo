const fs = require('fs')
const path = require('path')

function assert(condition, message) {
  if (!condition) {
    console.error('❌ Assertion failed:', message)
    process.exitCode = 1
    throw new Error(message)
  }
}

function loadAlbums() {
  const file = path.join(__dirname, 'albums.json')
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw)
}

function getNextId(albums) {
  if (!albums || albums.length === 0) return 1
  return Math.max(...albums.map(a => a.id)) + 1
}

async function run() {
  console.log('Running simple tests for album-api-v2 (no deps)')
  let albums = loadAlbums()

  // initial count
  assert(Array.isArray(albums), 'albums should be an array')
  assert(albums.length === 6, `expected 6 albums, got ${albums.length}`)

  // get by id
  const a1 = albums.find(a => a.id === 1)
  assert(a1 && a1.title && a1.artist, 'album id=1 should exist and have properties')

  // next id
  const next = getNextId(albums)
  assert(next === 7, `expected next id 7, got ${next}`)

  // create
  const newAlbum = { id: next, title: 'New Album', artist: 'Tester', price: 9.99, image_url: 'http://x' }
  albums.push(newAlbum)
  assert(albums.length === 7, 'after create length should be 7')
  assert(albums.find(a => a.id === next), 'created album should be findable')

  // update
  const idx = albums.findIndex(a => a.id === next)
  albums[idx].title = 'Updated Title'
  assert(albums[idx].title === 'Updated Title', 'album title should be updated')

  // delete
  const before = albums.length
  albums = albums.filter(a => a.id !== next)
  assert(albums.length === before - 1, 'album should be deleted')

  console.log('✅ All simple tests passed')
}

try {
  run()
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
