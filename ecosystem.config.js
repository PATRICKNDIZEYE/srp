module.exports = {
  apps: [{
    name: "gasabomilk-backend",
    script: "yarn",
    args: "dev", // Runs "yarn dev"
    cwd: "/var/www/gasabomilk.rw", // Your project root path
    interpreter: "/bin/bash",
    watch: true,
    env: {
      NODE_ENV: "production",
      PORT: 2025
    },
    // Required for Prisma
    autorestart: true,
    exec_mode: "fork",
    post_update: ["npx prisma generate"]
  }]
};
