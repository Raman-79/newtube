# Video Streaming Platform

A microservices-based video streaming platform built with modern technologies.

## Architecture Components

The platform consists of four major services:

- **Next.js Application**: Frontend application
- **User Service**: Handles user management and authentication
- **Transcode Service**: Manages video transcoding operations
- **Watch Service**: Manages video streaming and playback

## Setup Instructions

### 1. Next.js Application
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your credentials
```

### 2. User Service & Watch Service
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your credentials

# Initialize database
npx prisma migrate dev --name init
```

### 3. Transcode Service
> **Note**: FFmpeg must be installed locally on your system. Dockerization is in progress.

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your credentials
```

### Database Setup

Start PostgreSQL database using Docker:
```bash
docker run --name newtube_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=randompassword \
  -p 5432:5432 \
  -d postgres
```

## Contact

For support or inquiries:
- 📧 Email: singhraman0283@gmail.com
- 💼 LinkedIn: [Raman Singh](https://www.linkedin.com/in/raman-singh-0709rs/)

---
Feel free to open issues or submit pull requests for improvements.