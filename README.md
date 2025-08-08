# Blogger - React Blogging Website

A modern, responsive blogging website built with React, TypeScript, and Vite.

## Features

- 📝 Create and publish blog posts
- 📖 Read blog posts with clean, readable design
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Fast development with Vite
- 🔒 Type-safe with TypeScript
- 🧭 Client-side routing with React Router

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blogger
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── BlogList.tsx    # List of blog posts
│   ├── BlogPost.tsx    # Individual blog post view
│   └── CreatePost.tsx  # Form to create new posts
├── types/              # TypeScript type definitions
│   └── BlogPost.ts     # Blog post interface
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Features Overview

### Home Page
- Displays a list of all blog posts
- Shows post title, author, date, and excerpt
- Links to individual post pages

### Individual Post View
- Full blog post content
- Author and publication date
- Back navigation to home

### Create Post
- Form to create new blog posts
- Fields for title, author, excerpt, and content
- Auto-generates excerpt if not provided
- Redirects to home after publishing

## Styling

The application uses pure CSS with:
- CSS variables for consistent theming
- Responsive design using media queries
- Support for both light and dark color schemes
- Modern design with subtle shadows and rounded corners

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **ESLint** - Code linting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and ensure no errors
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## 🚀 Deployment

This project is ready to deploy on various platforms. Here are the supported deployment options:

### Vercel (Recommended)
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Vercel will automatically detect the Vite framework
3. Deploy with default settings - the `vercel.json` file will handle configuration

### Netlify
1. Connect your GitHub repository to [Netlify](https://netlify.com)
2. The `netlify.toml` file will configure the build settings automatically
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages
1. Install the gh-pages package: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

### Manual Deployment
1. Run `npm run build` to create the production build
2. Upload the contents of the `dist` folder to your web server
3. Configure your server to serve `index.html` for all routes (SPA routing)

### Build Commands
- `npm run build` - Full build with TypeScript checking
- `npm run build:prod` - Production build without TypeScript checking (faster)
- `npm run type-check` - Type checking only
- `npm run preview` - Preview the production build locally

### Environment Requirements
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
