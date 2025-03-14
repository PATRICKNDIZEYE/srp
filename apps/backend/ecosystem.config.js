≈module.exports = {
  apps: [{
    name: "gasabomilk-backend",
    script: "index.js",
    cwd: __dirname,
    interpreter: "node",
    env: {
      NODE_ENV: "production",
      PORT: 2025
    },
    autorestart: true,
    watch: false,
    exec_mode: "fork",
    time: true
  }]
};
