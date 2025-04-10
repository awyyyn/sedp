# Web Application for Scholars of SEDP - SIMBAG SA PAG-ASENSO, INC.

### Overview

This web application is designed for the scholars of **SEDP - SIMBAG SA PAG-ASENSO, INC.** (a microfinance NGO). The purpose of the application is to streamline processes related to managing scholars, enhancing accessibility to microfinance resources, and providing a platform for communication and tracking.

### Key Features

- **Scholar Registration**: Allows new scholars to register with basic information (name, contact, etc.).
- **Scholar Dashboard**: A personal dashboard where scholars can view their scholarships, track progress, and access resources.
- **Financial Aid Management**: Admins can track and manage the distribution of financial aid to scholars.
- **Notifications**: Sends notifications to scholars about updates, deadlines, or announcements related to the scholarship.
- **Document Upload**: Scholars and admins can upload required documents for verification and processing.

### Technologies Used

- **Programming Language**: TypeScript
- **Frontend**: ReactJS
- **Backend**: Node.js, Express.js, and GraphQL
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) or another method for secure login
- **Hosting/Deployment**: Vercel and Render

### Get Started

To get this application up and running locally on your machine:

1. Clone the repository:

   ```
   git clone git@github.com:awyyyn/sedp.git
   ```

2. Run server locally:

   ```JavaScript
    //  1.  Navigate to server
        cd server

    // 2. Install Dependencies
        npm install

    // 3. Generate Prisma
        npx prisma generate

    // 4. Environmental Variable
        //     - Create .env file in the server folder
        //     - Input the Env Variables (if you don't know ask for the main developer)
        DATABASE_URL=""
        PORT=
        SALT=
        EMAIL=""
        PASSWORD=""
        ACCESS_SECRET=""
        REFRESH_SECRET=""
        CLIENT_URL=""

    // 5. Run server
        npm  run dev
   ```

3. Run client application locally

   ```JavaScript
    // 1. Open new terminal

    // 2. Navigate to client folder

    // 3. Environmental Variable
        //     - Create .env file in the server folder
        //     - Input the Env Variables (if you don't know ask for the main developer)
        VITE_GQL_API_URL=""
        VITE_API_URL=""

    // 4. Install dependencies
         npm install

    // 5. Run application
        npm run dev
   ```

## Usage

- **For Scholars**:

  - Register as a new scholar using the "Sign Up" option.
  - Log in to access your personal dashboard.
  - Track your scholarship progress, view notifications, and upload required documents.

- **For Admins**:
  - Use the admin login to manage scholars, financial aid, and resources.
  - You can approve or reject scholarship applications and communicate with the scholars.

## Copyright

© 2025 SEDP - SIMBAG SA PAG-ASENSO, INC. All rights reserved. This repository is private and intended for authorized personnel only.
