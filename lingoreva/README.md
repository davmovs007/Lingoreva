# Lingoreva - English Learning App

For full documentation, architecture diagrams, and guides, see the root [README.md](../README.md) (Russian) or [README.en.md](../README.en.md) (English).

Lingoreva is a comprehensive, commercial-grade application for learning English, designed with a modern architecture, personalized learning paths, and spaced repetition.

## Architecture

The project follows a standard client-server architecture:
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Security (JWT), Spring Data JPA, Flyway.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, React Router, Vitest.
- **Database**: PostgreSQL 15 for production, H2 for tests and local fallback.
- **Infrastructure**: Docker and Docker Compose for easy deployment.

## Project Structure
- `/backend`: The Spring Boot API server.
- `/frontend`: The React application with UI components.
- `docker-compose.yml`: For spinning up the Postgres database, backend, and frontend.

## How to Run Locally

### 1. Using Docker Compose (Quickest)
```bash
docker-compose up --build -d
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Manual Development Run

#### Prerequisites
- JDK 21
- Node.js 18+ and npm
- Docker (optional, for running Postgres)

#### Backend
```bash
cd backend
mvn spring-boot:run
```
Server runs at `http://localhost:8080`.

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
Application runs at `http://localhost:3000`.

## Testing
- Backend: `mvn test` (or `mvn test -DargLine="-Dnet.bytebuddy.experimental=true"` on Java 24+)
- Frontend: `npm test`
