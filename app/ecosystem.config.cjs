module.exports = {
  apps: [
    {
      name: 'text2img',
      cwd: __dirname,
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 8765
      }
    }
  ]
};
