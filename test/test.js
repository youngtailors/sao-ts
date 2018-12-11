import path from 'path'
import test from 'ava'
import sao from 'sao'

const generator = path.join(__dirname, '..')
const name = 'Hello world'

test('defaults', async t => {
  const stream = await sao.mock({ generator }, { name })

  t.snapshot(stream.fileList, 'Generated files')

  const indexFile = await stream.readFile('src/index.ts')
  t.truthy(indexFile.includes(name.toLowerCase()))
})

test('ESLint tool: xo', async t => {
  const stream = await sao.mock({ generator }, { eslint: 'xo' })
  const pkg = await stream.readFile('package.json')
  const pkgJson = JSON.parse(pkg)
  t.truthy(pkgJson.xo)
  t.truthy(pkgJson['lint-staged'].linters['*.{ts,js}'])
})

test('ESLint tool: disable', async t => {
  const stream = await sao.mock({ generator }, { eslint: 'disable' })
  const pkg = await stream.readFile('package.json')
  const pkgJson = JSON.parse(pkg)
  t.falsy(pkgJson.xo)
  t.falsy(pkgJson['lint-staged'].linters['*.{ts,js}'])
})
