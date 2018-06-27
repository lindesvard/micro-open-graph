module.exports = {
  apps: [
    {
      name: "micro-open-graph",
      script: "npm",
      args: "start",
      env: {
        // COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "web",
      host: "37.139.20.215",
      port: "22123",
      ref: "origin/master",
      repo: "git@github.com:lindesvard/micro-open-graph.git",
      path: "/home/web/services/chat",
      "post-deploy":
        "yarn install --production=false && pm2 startOrRestart ecosystem.config.js"
    }
  }
};
