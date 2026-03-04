

User Interface
- Dark & Light Mode
- Responsive Design
- Smooth Animations
- Modern UI Components

### Pages
 -login
 -Dashboard
 -Scan
 -demo pages for other tabs

## Tech Stack

- Framework: Next.js 16.1.6 (App Router)
- Language: TypeScript 5
- Styling: Tailwind CSS 4
- Animations: Framer Motion 12.34.5
- Icons: Lucide React
- Theme Management: next-themes
- Font: Outfit 
- clsx

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
bash
git clone <repository-url>
cd repository-name

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```



### Layout Components
- AppLayout
- Sidebar

### UI Components
- Button
- Badge
- StatusChip
- ProgressBar
- Toast
- Skeleton


### Theme System
The application supports both dark and light modes with smooth transitions. Theme preference is persisted using `next-themes` and can be toggled from any page.

### Responsive Breakpoints
- Mobile: 365px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px+
- Max Width: 1600px (centered layout)

### Mock Data
The application uses mock data located in `src/data/mock.ts` for:
- Scan listings
- Activity logs
- Verification logs
- Vulnerability findings
- Dashboard statistics


### Styling Approach
- Tailwind CSS utility classes for styling
- Custom CSS variables for theme colors in `globals.css`
- Consistent spacing and typography system
- Custom gradient backgrounds for login page

### Animation Strategy
- Framer Motion for page transitions and component animations
- CSS transitions for hover states and micro-interactions


### State Management
- React hooks (useState, useEffect, useRef) for local state
- Custom hooks for toast notifications

## Deployment

This application deployed on:
- Vercel

