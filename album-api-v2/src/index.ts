import app from './app'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`album-api-v2 listening on http://localhost:${PORT}`)
})
