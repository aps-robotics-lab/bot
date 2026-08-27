import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          events: path.resolve(__dirname, 'events.html'),
          registration: path.resolve(__dirname, 'registration.html'),
          announcements: path.resolve(__dirname, 'announcements.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          author: path.resolve(__dirname, 'author-control.html'),
          eventRace: path.resolve(__dirname, 'events/robo-race.html'),
          eventWar: path.resolve(__dirname, 'events/robo-war.html'),
          eventTug: path.resolve(__dirname, 'events/robo-tug-of-war.html'),
          eventSoccer: path.resolve(__dirname, 'events/robo-soccer.html'),
          rulesRace: path.resolve(__dirname, 'rules/robo-race.html'),
          rulesWar: path.resolve(__dirname, 'rules/robo-war.html'),
          rulesTug: path.resolve(__dirname, 'rules/robo-tug-of-war.html'),
          rulesSoccer: path.resolve(__dirname, 'rules/robo-soccer.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
