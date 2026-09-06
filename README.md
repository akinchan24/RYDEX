# 🚗 Rydex — Vehicle Booking Platform

Rydex is a **full-stack vehicle booking platform** built with **Next.js and TypeScript**, designed to connect users with vehicle partners through a modern, feature-rich web application.

The platform includes user authentication, vehicle booking, partner onboarding, real-time communication, map integration, online payments, and administrative management.

---

## ✨ Features

### 👤 User Authentication

* Secure user authentication with **NextAuth**
* Session management
* Protected routes and user-specific functionality
* Role-based access for different platform users

### 🚘 Vehicle Booking

* Browse and explore available vehicles
* View vehicle details
* Select booking details
* Create and manage bookings
* Booking status management

### 🤝 Driver / Partner Onboarding

* Driver and partner registration
* Partner profile management
* Vehicle information management
* Partner-side booking management

### 🗺️ Maps & Location

* Integrated map functionality
* Location-based booking features
* Map-based location selection
* Location visualization

### 💳 Online Payments

* **Razorpay** payment gateway integration
* Online booking payments
* Payment status handling
* Test-mode payment support during development

### 💬 Real-Time Communication

* Real-time communication using **Socket.IO**
* Instant messaging functionality
* Real-time updates between connected users

### 🛠️ Admin Management

* Administrative dashboard
* User management
* Partner/driver management
* Vehicle management
* Booking management

### 📱 Responsive Interface

* Responsive design for different screen sizes
* Modern and user-friendly interface
* Component-based frontend architecture

---

# 🧑‍💻 Tech Stack

| Technology             | Purpose                               |
| ---------------------- | ------------------------------------- |
| **Next.js**            | Full-stack React framework            |
| **TypeScript**         | Type-safe application development     |
| **React.js**           | UI development                        |
| **MongoDB**            | Database                              |
| **NextAuth.js**        | Authentication and session management |
| **Socket.IO**          | Real-time communication               |
| **Razorpay**           | Payment processing                    |
| **Maps API**           | Maps and location functionality       |
| **CSS / Tailwind CSS** | Styling                               |
| **Git & GitHub**       | Version control                       |

---

# 🏗️ Architecture

Rydex uses Next.js to handle the application's frontend and server-side functionality while integrating external services for authentication, payments, maps, and real-time communication.

```text
                         ┌──────────────────┐
                         │      Rydex       │
                         │   Next.js App    │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Authentication       Application          Database
         NextAuth.js          Logic / API         MongoDB
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
             Razorpay         Socket.IO          Maps API
             Payments       Real-time Chat       Location
```

---

# 🔄 Booking Workflow

```text
User
 │
 ▼
Sign In / Register
 │
 ▼
Browse Vehicles
 │
 ▼
Select Vehicle
 │
 ▼
Choose Booking Details
 │
 ▼
Create Booking
 │
 ▼
Razorpay Payment
 │
 ▼
Payment Verification
 │
 ▼
Booking Confirmation
 │
 ▼
Real-Time Communication
```

---

# 🔐 Authentication

Rydex uses **NextAuth.js** for authentication and session management.

Authentication is integrated into the application to provide:

* Secure user sessions
* Protected application routes
* Authenticated user actions
* User-specific data
* Role-based functionality

---

# 💳 Razorpay Integration

Rydex integrates **Razorpay** to support online payments for bookings.

The payment flow includes:

1. Initiating a booking
2. Creating the payment order
3. Opening the Razorpay checkout
4. Processing the payment
5. Verifying the transaction
6. Updating the booking/payment status

> ⚠️ Razorpay test credentials should be used during development. Never commit API secrets or `.env` files to GitHub.

---

# 💬 Real-Time Communication

**Socket.IO** is used to provide real-time communication within the platform.

This enables functionality such as:

* Real-time messaging
* Instant communication
* Live updates
* Booking-related communication

---

# 🗺️ Maps Integration

Rydex integrates a Maps API to support location-based functionality.

Maps are used for features such as:

* Location selection
* Location visualization
* Booking-related locations
* Map-based interactions

---

# 📁 Project Structure

A simplified representation of the project structure:

```text
rydex/
│
├── app/
│   ├── api/
│   ├── components/
│   ├── dashboard/
│   ├── booking/
│   ├── login/
│   └── ...
│
├── components/
│   ├── Navbar/
│   ├── Footer/
│   ├── Booking/
│   └── ...
│
├── lib/
│   ├── database/
│   ├── auth/
│   └── ...
│
├── models/
│   ├── User
│   ├── Vehicle
│   ├── Booking
│   └── ...
│
├── public/
│
├── types/
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> The exact folder structure may differ depending on the current version of the project.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm or pnpm
* MongoDB
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/rydex.git
```

Navigate into the project:

```bash
cd rydex
```

---

## 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

Example:

```env
MONGODB_URI=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

MAP_API_KEY=
```

Add any other environment variables required by your project.

> 🔒 Never commit `.env.local` or expose private API keys.

---

## 4. Run the Development Server

Using npm:

```bash
npm run dev
```

Or pnpm:

```bash
pnpm dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

# 🧪 Development

Rydex was developed as a practical full-stack application to gain hands-on experience with modern web development.

The project focuses on implementing real-world functionality including:

* Full-stack development with Next.js
* TypeScript-based development
* Database integration
* Authentication
* Payment gateway integration
* Real-time communication
* Third-party API integration
* Role-based workflows
* API development
* Deployment and environment configuration

---

# 🔮 Future Improvements

Planned or potential improvements include:

* Advanced vehicle filtering and search
* Driver availability tracking
* Live vehicle tracking
* Push notifications
* Ratings and reviews
* Booking cancellation and refund workflows
* Advanced admin analytics
* Improved security and validation
* Performance optimization
* Progressive Web App support

---

# 📌 Project Status

**🚧 Active Development**

Rydex is an ongoing project and is being continuously improved while exploring modern full-stack development practices and production-ready application architecture.

---

# 🎯 What I Learned

Building Rydex provided practical experience with:

* Next.js application architecture
* TypeScript
* Authentication and authorization
* MongoDB
* API development
* Payment gateway integration
* WebSocket-based communication
* Maps and location APIs
* Environment variables and secrets
* Git and GitHub
* Deployment workflows
* Building and connecting multiple application features into a single platform

---

# 👨‍💻 About the Project

Rydex is a practical full-stack project created to explore how a real-world vehicle booking platform can be designed and implemented using modern web technologies.

The project brings together **authentication, bookings, payments, maps, real-time communication, database operations, and administrative functionality** into one application.

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐.

**Built with Next.js + TypeScript 🚀**
