# Recetario

A mobile app to save, organize and explore cooking recipes. Built with React Native and Expo.

## Features

- **Authentication** — Register and login with JWT. Automatic token refresh.
- **My Recipes** — Create, edit and delete your own recipes with ingredients and preparation steps.
- **Explore** — Browse all recipes from every user with a real-time search bar.
- **Groups** — Organize your recipes into groups. Add and remove recipes from a group from multiple screens.
- **Profile** — Edit your name and email, or delete your account.

## Tech Stack

- [Expo](https://expo.dev) (SDK 54, Managed Workflow)
- [Expo Router](https://expo.github.io/router) — file-based navigation
- [TanStack React Query](https://tanstack.com/query) — data fetching and caching
- [Zustand](https://zustand-demo.pmnd.rs) — global auth state
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — forms and validation
- [Axios](https://axios-http.com) — HTTP client with JWT interceptors

## Backend

REST API deployed on Railway: `https://recipe-app-back-production.up.railway.app`

Built with NestJS + Prisma + PostgreSQL.

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (same WiFi network required).
