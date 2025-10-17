# SWE-2025

Requirements: https://studentsloyola-my.sharepoint.com/:x:/r/personal/jpfielding_loyola_edu/Documents/SWE%20Project/Project%20Assignment%20%231%20-%20Requirements/User%20Stories.xlsx?d=w9b324f5099ae469c85e4ce6ab49692fc&csf=1&web=1&e=gJpfIG

# Running

## Separately
To run the backend, from the repo root directory run:

```
cd backend

./gradlew bootRun
```

To run the frontend, from the repo root directory run:

```
cd frontend

npm i
npm run dev
```

## With Docker
Docker compose can also be used to run the project

To run it with docker compose, run:

```
docker compose build
docker compose up
```