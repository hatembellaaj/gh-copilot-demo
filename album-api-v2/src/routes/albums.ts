import { Router } from 'express'
import type { Request, Response } from 'express'
import type { Album } from '../models/album'
import { albums, getNextId } from '../data/albums'

const router = Router()

// GET /albums - list all
router.get('/', (_req: Request, res: Response<Album[]>) => {
  res.json(albums)
})

// GET /albums/:id - get one
router.get('/:id', (req: Request, res: Response<Album | { message: string }>) => {
  const id = Number(req.params.id)
  const found = albums.find(a => a.id === id)
  if (!found) return res.status(404).json({ message: 'Album not found' })
  res.json(found)
})

// POST /albums - create
router.post('/', (req: Request, res: Response<Album | { message: string }>) => {
  const body = req.body as Partial<Album>
  if (!body.title || !body.artist || typeof body.price !== 'number' || !body.image_url) {
    return res.status(400).json({ message: 'Invalid album payload' })
  }

  const newAlbum: Album = {
    id: getNextId(),
    title: body.title,
    artist: body.artist,
    price: body.price,
    image_url: body.image_url
  }

  albums.push(newAlbum)
  res.status(201).json(newAlbum)
})

// PUT /albums/:id - update
router.put('/:id', (req: Request, res: Response<Album | { message: string }>) => {
  const id = Number(req.params.id)
  const idx = albums.findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Album not found' })

  const body = req.body as Partial<Album>
  const updated: Album = {
    id,
    title: body.title ?? albums[idx].title,
    artist: body.artist ?? albums[idx].artist,
    price: body.price ?? albums[idx].price,
    image_url: body.image_url ?? albums[idx].image_url
  }

  albums[idx] = updated
  res.json(updated)
})

// DELETE /albums/:id
router.delete('/:id', (req: Request, res: Response<{ message?: string }>) => {
  const id = Number(req.params.id)
  const idx = albums.findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Album not found' })
  albums.splice(idx, 1)
  res.status(204).send()
})

export default router
