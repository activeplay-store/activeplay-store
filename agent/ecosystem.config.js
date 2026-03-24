module.exports = {
  apps: [{
    name: 'ap-agent',
    script: 'src/index.js',
    cwd: '/var/www/activeplay-store/agent',
    env: {
      NODE_ENV: 'production',
      TZ: 'Europe/Moscow'
    },
    autorestart: true,
    max_restarts: 10,
    restart_delay: 5000,
    error_file: '/root/.pm2/logs/ap-agent-error.log',
    out_file: '/root/.pm2/logs/ap-agent-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
