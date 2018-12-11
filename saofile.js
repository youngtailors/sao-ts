const superb = require('superb')

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase(),
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`,
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true,
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true,
        validate: v => /.+@.+/.test(v),
      },
      {
        name: 'website',
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true,
      },
      {
        name: 'eslint',
        message: 'Choose an ESLint tool',
        type: 'list',
        default: 'xo',
        choices: ['xo', 'disable'],
      },
    ]
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_package.json': 'package.json',
        },
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: data => require('./lib/update-pkg')(this.answers, data),
      },
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  },
}
