module.exports = {
  apps: [
    {
      name: "deck-commander",
      script: "dist/server/standalone.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
