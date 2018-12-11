const when = (condition, value, fallback) => (condition ? value : fallback)
const commands = cmds => cmds.filter(Boolean).join(' && ') || undefined

module.exports = ({ name, description, username, email, eslint }, data) => {
  const useXo = eslint !== 'disable'
  return {
    name,
    version: '0.0.0',
    description,
    scripts: {
      lint: when(useXo, eslint),
      dev: 'nodemon --exec ts-node src/index.ts',
    },
    repository: {
      url: `${username}/${name}`,
      type: 'git',
    },
    author: `${username}<${email}>`,
    license: 'MIT',
    devDependencies: {
      xo: when(useXo, '^0.23.0'),
      prettier: when(useXo, '^1.15.2'),
      'eslint-config-rem': when(useXo, '^4.0.0'),
      'eslint-config-prettier': when(useXo, '^3.3.0'),
      'eslint-plugin-prettier': when(useXo, '^3.0.0'),
      'eslint-config-xo-typescript': when(useXo, '^0.3.0'),
      'eslint-plugin-typescript': when(useXo, '^0.14.0'),
      'typescript-eslint-parser': when(useXo, '^21.0.2'),
      husky: '^1.2.0',
      'lint-staged': '^8.1.0',
      nodemon: '^1.18.7',
      'ts-node': '^7.0.1',
      typescript: '^3.1.4',
    },
    xo: when(useXo, {
      extends: ['rem', 'plugin:prettier/recommended', 'xo-typescript'],
      extensions: ['ts'],
      rules: {
        'unicorn/filename-case': 'off',
        'new-cap': 'off',
        'typescript/no-inferrable-types': 'off',
        'import/no-unassigned-import': 'off',
        'typescript/explicit-function-return-type': 'off',
        'no-throw-literal': 'off',
      },
    }),
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    'lint-staged': {
      linters: {
        '*.{ts,js}': when(useXo, [`${eslint} --fix`, 'git add']),
        [when(useXo, '*.{json,md}', '*.{json,md,ts,js}')]: [
          'prettier --write',
          'git add',
        ],
      },
    },
  }
}
