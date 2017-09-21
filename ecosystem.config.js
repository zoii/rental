module.exports = {
  apps: [{
    name: 'RENTAL',
    script: 'app/server/index.js',
    watch: 'app',
    env_development: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};

