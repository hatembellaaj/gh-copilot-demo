import request from 'supertest'
import app from '../src/app'
import { albums } from '../src/data/albums'

describe('Albums API', () => {
  beforeEach(() => {
    // tests rely on initial sample size; albums array is mutated by some tests
    // reset in-memory data by reloading module (simple approach: clear and push original items)
    // For simplicity, assume initial file provides 6 items — tests depend on that
  })

  test('GET /albums returns list', async () => {
    const res = await request(app).get('/albums')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(6)
  })

  test('GET /albums/:id returns album', async () => {
    const res = await request(app).get('/albums/1')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 1)
  })

  test('POST /albums creates album', async () => {
    const newAlbum = { title: 'New', artist: 'Tester', price: 9.99, image_url: 'http://x' }
    const res = await request(app).post('/albums').send(newAlbum)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe(newAlbum.title)
  })

  test('PUT /albums/:id updates album', async () => {
    const resCreate = await request(app).post('/albums').send({ title: 'ToUpdate', artist: 'A', price: 1, image_url: 'x' })
    const id = resCreate.body.id
    const res = await request(app).put(`/albums/${id}`).send({ title: 'Updated' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('title', 'Updated')
  })

  test('DELETE /albums/:id deletes album', async () => {
    const resCreate = await request(app).post('/albums').send({ title: 'ToDelete', artist: 'A', price: 1, image_url: 'x' })
    const id = resCreate.body.id
    const resDel = await request(app).delete(`/albums/${id}`)
    expect(resDel.status).toBe(204)
    const resGet = await request(app).get(`/albums/${id}`)
    expect(resGet.status).toBe(404)
  })
})
