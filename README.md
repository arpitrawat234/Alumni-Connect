# AlumniConnect 🎓

Smart Alumni Guidance & Mentorship Platform.

## Overview
AlumniConnect bridges the gap between students and graduates in the industry. It enables students to find alumni by company, role, skills, and industry, read authentic career journeys, ask questions, and seek mentorship.

## Phase 1: Frontend Prototype
Phase 1 focuses entirely on the React frontend prototype with client-side routing, rich mock data, and derived state filtering.

### Features
- **Landing Page**: Value proposition hero, navigation links, and community highlights.
- **Find Alumni**: Instant search (by name, company, role, skills) + multi-filtering (Role, Company, Industry).
- **Alumni Profiles**: Dynamic routes (`/alumni/:id`) with career journeys, skills, advice, and contact details.
- **Authentication Stubs**: Controlled Login and Signup forms with role selection (Student / Alumni) routing to Dashboard.
- **Dashboard**: Quick-access hub to directory, personal profile, and Q&A boards.
- **Discussion Board (Q&A)**: Community Q&A feed with question posting support.
- **Responsive Modern UI**: Built with custom modern CSS variables and Lucide icons.

## Tech Stack
- **Frontend**: React, React Router (`react-router-dom`), Vite
- **Icons**: Lucide React
- **Styling**: Vanilla Modern CSS Design System

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

1. Navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
