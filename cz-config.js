module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'style',
      name:
        'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'refactor',
      name:
        'refactor: A code change that neither fixes a bug nor adds a feature'
    },
    {
      value: 'perf',
      name: 'perf:     A code change that improves performance'
    },
    { value: 'test', name: 'test:     Adding missing tests' },
    {
      value: 'build',
      name:
        'build:    Changes that affect the build system or external dependencies\n            (example scopes: gulp, broccoli, npm)'
    },
    {
      value: 'ci',
      name:
        'ci:       Changes to our CI configuration files and scripts\n            (example scopes:Travis, Circle, BrowserStack, SauceLabs)'
    },
    {
      value: 'chore',
      name:
        'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'
    },
    { value: 'revert', name: 'revert:   Revert to a commit' }
  ],
  scopes: ['project', 'parser', 'actions', 'ui', 'storage', 'tests'],
  allowCustomScopes: false
};
