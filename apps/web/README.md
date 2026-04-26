# Skeleton TailAdmin (NestJS + Next.js)

A professional full-stack skeleton featuring a **NestJS API** and a **Next.js Frontend** with TailAdmin UI, Prisma ORM, JWT Authentication, and full i18n support.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, TypeScript, `next-intl`.
- **Backend:** NestJS, Passport JWT, Bcrypt, `cookie-parser`.
- **Database:** Prisma ORM (PostgreSQL/MySQL support).
- **UI Components:** Atomic design with custom Inputs, Buttons, and Sidebar context.

---

## 🛠️ Installation

Follow these steps to set up the environment locally.

### 1. Prerequisites

Ensure you have the following installed:
- Node.js 18+
- npm or pnpm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine.

### 2. Infrastructure Setup (Database)

Spin up the PostgreSQL instance using Docker Compose:
```bash
docker-compose up -d
```

### 3. Clone and Install Dependencies

Clone the repository and install the packages for both the API and the Web application.

```bash
git clone <your-repo-url>
cd skeletonTail
npm install
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
