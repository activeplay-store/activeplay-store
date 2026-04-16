module.exports = {
  apps: [
    {
      name: 'activeplay',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/activeplay-store',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'ap-agent',
      script: 'agent/src/index.js',
      cwd: '/var/www/activeplay-store',
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'ap-agent-bot',
      script: 'bot.js',
      cwd: '/home/activeplay/agent-bot',
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
