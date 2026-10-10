# Lingoreva - English Learning App

Lingoreva is a comprehensive, commercial-grade application for learning English, designed with a modern architecture, personalized learning paths, and spaced repetition.

## Architecture

The project follows a standard client-server architecture:
- **Backend**: Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, Flyway.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, React Router.
- **Database**: PostgreSQL for production, H2 for tests.
- **Infrastructure**: Docker and Docker Compose for easy deployment.

## Project Structure
- `/backend`: The Spring Boot API server.
- `/frontend`: The React application with UI components.
- `docker-compose.yml`: For spinning up the Postgres database and backend.

## How to Run Locally

### Prerequisites
- JDK 21
- Node.js 18+ and npm
- Docker (optional, for running Postgres)

### 1. Database Setup
You can use Docker to run the PostgreSQL database:
```bash
docker-compose up -d postgres
```

### 2. Backend
Navigate to the `backend` directory:
```bash
cd backend
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`.
Swagger UI will be available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## Modules Implemented (Core MVP Complete)
- **Frontend Application**: Fully routed React application with polished Tailwind UI. Includes Dashboard, Login, Register, Vocabulary Review, Daily Lesson, and Placement Test screens.
- **Authentication & Authorization**: Secure JWT-based registration and login.
- **User Profile & Onboarding**: API to save learning preferences, course duration, and daily goals.
- **Placement Test**: Interactive UI and backend evaluator for initial CEFR level assignment.
- **Spaced Repetition System (Vocabulary)**: SM-2 inspired algorithm with interactive flashcard UI.
- **Daily Lessons Module**: Course trajectory unlock system, XP, and streak tracking with reading UI.
- **Database Migrations**: Flyway integration (V1, V2, V3) populated with semantic content.

## Next Steps for Production
1. **Interactive Exercises**: Expand the Daily Lesson content to include interactive multiple-choice and fill-in-the-blank questions.
2. **Payment Gateway Integration**: Integrate Stripe or a similar provider in the placeholder Subscription module.
3. **SSL and Domain**: Secure the application with HTTPS and a custom domain.
4. **CI/CD Pipeline**: Deploy via GitHub Actions to a cloud provider (AWS/GCP/DigitalOcean).

