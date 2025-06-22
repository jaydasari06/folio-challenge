# Design QA Agent - Canva App ✅ **FULLY FUNCTIONAL**

An AI-powered design quality analysis tool for Canva that automatically detects design issues and provides actionable recommendations to improve accessibility, visual consistency, and overall design quality.

## 🎨 User Interface

The app features a modern, intuitive interface with:

### Smart Design Detection
- **Empty state handling** when no design content is detected
- **Step-by-step instructions** for first-time users
- **Contextual help** and usage guidelines

### Analysis Dashboard
- **Overall design score** with visual progress bar
- **Quick summary** of passed/failed checks
- **Color-coded feedback** (green for success, red for issues)

### Multi-Tab Results View
1. **Overview** - Quick summary and issue categorization
2. **Issues** - Detailed accordion with expandable issue descriptions
3. **AI Insights** - AI-powered analysis and suggestions (when enabled)
4. **Tips** - Design best practices and Canva guidelines

### Interactive Features
- **One-click analysis** with loading states
- **Re-analysis capability** for iterative design improvement
- **External link integration** to Canva design guidelines
- **Responsive layout** optimized for the Canva side panel

**Development Tools:**ity analysis tool for Canva that automatically detects design issues and provides actionable recommendations to improve accessibility, visual consistency, and overall design quality.

**🎉 Status: Complete and ready for the Folio Challenge!**

## ✨ What Makes This Implementation Special

This Design QA Agent represents a **production-ready Canva app** with several standout features:

### 🧠 Advanced AI Integration
- **Google Gemini AI** integration for intelligent design analysis
- **Context-aware suggestions** that understand design intent
- **Free tier implementation** that works out of the box

### 🎯 Real Design Analysis
- **Actual Canva element analysis** - not just mock data
- **Multi-criteria evaluation** (contrast, typography, alignment, accessibility)
- **Scoring algorithm** that provides actionable insights

### 🧪 Comprehensive Testing
- **7 comprehensive tests** covering all major functionality
- **Proper Canva SDK test mocks** for reliable testing
- **React Testing Library** best practices implementation

### 🎨 Professional UI/UX
- **Multi-tab interface** following Canva design guidelines
- **Smart state management** with proper loading and error states
- **Responsive design** optimized for Canva's side panel

### 🔧 Developer Experience
- **One-command setup** with automated scripts
- **Type-safe development** with comprehensive TypeScript definitions
- **Hot module replacement** for rapid development
- **Production-ready architecture** with proper error handling

## 🚀 Project Overview

This Canva app analyzes designs using both rule-based algorithms AND AI-powered insights to provide comprehensive feedback on:

- **Color Contrast** - WCAG compliance checking
- **Typography** - Font consistency and readability
- **Alignment** - Grid-based layout analysis
- **Spacing** - Consistent spacing patterns
- **Accessibility** - Alt text, screen reader compatibility
- **🤖 AI Analysis** - Intelligent context-aware suggestions using Google Gemini

### Key Features

- **Real-time design analysis** using Python backend
- **AI-powered insights** using Google Gemini API (free tier)
- **Comprehensive QA scoring system** with detailed metrics
- **Multi-tab interface** with Overview, Issues, AI Insights, and Tips
- **Detailed issue reporting** with severity levels and actionable suggestions
- **AI-generated design feedback** and context-aware recommendations
- **Design best practices** integration with Canva guidelines
- **Responsive mobile interface** with Canva's official App UI Kit
- **Smart design detection** with empty state handling
- **Real element analysis** from Canva designs

## 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Canva Apps SDK
- Canva App UI Kit for consistent styling
- React Intl for internationalization
- **Comprehensive test suite** with Jest and React Testing Library
- **Proper SDK test providers** for reliable testing

**Backend:**
- Python 3.8+ with Flask
- Flask-CORS for cross-origin requests
- **Google Gemini AI** for intelligent analysis
- **python-dotenv** for environment management
- Advanced color contrast analysis
- Typography and spacing algorithms
- Accessibility compliance checking

## 🤖 AI Setup (Free!)

To enable AI-powered insights, get a free Gemini API key:

### 1. Get Your Free API Key
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in navigation
4. Click "Create API key in new project"
5. Copy the generated API key

### 2. Configure the API Key
Add your API key to `.env`:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Restart the Backend
```bash
python backend.py
```

**Note:** The app works perfectly without the API key (rule-based analysis only). With the API key, you get additional AI-powered insights!

### Free Tier Limits
- 60 requests per minute
- 1,500 requests per day
- Perfect for development and demo!

**Development Tools:**
- Webpack for bundling
- Jest for testing
- ESLint for code quality
- Prettier for formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Canva CLI (for development)

### 🚀 Quick Start (One Command)

```bash
# Start everything with one command
./start-all.sh
```

This script will:
1. Install all dependencies (Python + Node.js)
2. Start the backend on http://localhost:5001
3. Start the frontend on https://localhost:8080
4. Run connectivity tests
5. Open your app ready for development

### 📋 Manual Start (Step by Step)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd folio-challenge

# Install frontend dependencies
npm install

# Install Python backend dependencies
pip3 install -r requirements.txt
# This installs: flask, flask-cors, google-generativeai, python-dotenv
```

### 2. Start the Backend Server

```bash
# Option 1: Use the startup script
./start-backend.sh

# Option 2: Start manually
python3 backend.py
```

The backend will start on `http://localhost:5001` with the following endpoints:
- `POST /api/analyze` - Analyze design data
- `GET /api/analyze/test` - Test with sample data  
- `GET /health` - Health check

### 3. Start the Frontend (Canva App)

In a new terminal:

```bash
# Start the development server
npm start

# The app will be available at https://localhost:8080
# Use this URL in Canva's app development environment
```

### 4. Test the Integration

1. Open the backend test endpoint: `http://localhost:5001/api/analyze/test`
2. Verify you see sample analysis results
3. Run the frontend and ensure it connects to the backend
4. Check the browser console for any connection errors

## 🏗 Project Structure

```
src/
├── app.tsx                    # Main app component with multi-tab QA dashboard
├── index.tsx                  # App entry point with providers
├── types/
│   └── qa-types.ts           # TypeScript type definitions for QA system
├── services/
│   └── qa-analysis-service.ts # QA analysis service (connects to Python backend)
├── utils/
│   └── design-utils.ts       # Canva design API utilities and selection handling
├── tests/
│   ├── qa-agent.test.tsx     # Comprehensive component tests (7 tests)
│   └── app.tests.tsx         # Additional app tests
└── styles/
    └── components.css        # Component styles

backend.py                     # Python Flask backend with AI integration
requirements.txt               # Python dependencies (Flask, Gemini AI, etc.)
jest.setup.ts                  # Test environment setup with Canva SDK mocks
start-backend.sh              # Backend startup script
start-all.sh                  # One-command startup script
```

## 🔧 Development Requirements

- Node.js `v18` or `v20.10.0`
- npm `v9` or `v10`
- Python 3.8+
- pip3

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The [.nvmrc](/.nvmrc) file in the root directory of this repo will ensure the correct version is used once you run `nvm install`.

## 🧪 Testing

### Run Frontend Tests

The project includes comprehensive tests for the QA Agent functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Update test snapshots
npm run test:update
```

**Test Coverage:**
- ✅ QA Agent app component tests (7 tests)
- ✅ JWT middleware tests
- ✅ Utility function tests
- ✅ Integration tests

**Note:** The test suite uses proper Canva SDK test providers (`TestAppI18nProvider`, `TestAppUiProvider`) and mocks for reliable testing.

### Test Backend API

```bash
# Test the health endpoint
curl http://localhost:5001/health

# Test the analysis endpoint with sample data
curl http://localhost:5001/api/analyze/test
```

## 📋 Available Scripts

### Frontend Scripts

```bash
npm install
```

## Running your Canva App

### Step 1: Start the local development server

To start the boilerplate's development server, run the following command:

```bash
npm start
```

The server becomes available at <http://localhost:8080>.

The app's source code is in the `src/app.tsx` file.

### Step 2: Preview the app

The local development server only exposes a JavaScript bundle, so you can't preview an app by visiting <http://localhost:8080>. You can only preview an app via the Canva editor.

To preview an app:

1. Create an app via the [Developer Portal](https://www.canva.com/developers/apps).
2. Select **App source > Development URL**.
3. In the **Development URL** field, enter the URL of the development server.
4. Click **Preview**. This opens the Canva editor (and the app) in a new tab.
5. Click **Open**. (This screen only appears when using an app for the first time.)

The app will appear in the side panel.

<details>
  <summary>Previewing apps in Safari</summary>

By default, the development server is not HTTPS-enabled. This is convenient, as there's no need for a security certificate, but it prevents apps from being previewed in Safari.

**Why Safari requires the development server to be HTTPS-enabled?**

Canva itself is served via HTTPS and most browsers prevent HTTPS pages from loading scripts via non-HTTPS connections. Chrome and Firefox make exceptions for local servers, such as `localhost`, but Safari does not, so if you're using Safari, the development server must be HTTPS-enabled.

To learn more, see [Loading mixed-content resources](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#loading_mixed-content_resources).

To preview apps in Safari:

1. Start the development server with HTTPS enabled:

```bash
npm start --use-https
```

2. Navigate to <https://localhost:8080>.
3. Bypass the invalid security certificate warning:
   1. Click **Show details**.
   2. Click **Visit website**.
4. In the Developer Portal, set the app's **Development URL** to <https://localhost:8080>.
5. Click preview (or refresh your app if it's already open).

You need to bypass the invalid security certificate warning every time you start the local server. A similar warning will appear in other browsers (and will need to be bypassed) whenever HTTPS is enabled.

</details>

### (Optional) Step 3: Enable Hot Module Replacement

By default, every time you make a change to an app, you have to reload the entire app to see the results of those changes. If you enable [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR), changes will be reflected without a full reload, which significantly speeds up the development loop.

**Note:** HMR does **not** work while running the development server in a Docker container.

To enable HMR:

1. Navigate to an app via the [Your apps](https://www.canva.com/developers/apps).
2. Select **Configure your app**.
3. Copy the value from the **App origin** field. This value is unique to each app and cannot be customized.
4. In the root directory, open the `.env` file.
5. Set the `CANVA_APP_ORIGIN` environment variable to the value copied from the **App origin** field:

   ```bash
   CANVA_APP_ORIGIN=# YOUR APP ORIGIN GOES HERE
   ```

6. Set the `CANVA_HMR_ENABLED` environment variable to `true`:

   ```bash
   CANVA_HMR_ENABLED=true
   ```

7. Restart the local development server.
8. Reload the app manually to ensure that HMR takes effect.

## Running an app's backend

Some templates provide an example backend. This backend is defined in the template's `backend/server.ts` file, automatically starts when the `npm start` command is run, and becomes available at <http://localhost:3001>.

To run templates that have a backend:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
2. Copy the ID of an app from the **App ID** column.
3. In the starter kit's `.env` file, set `CANVA_APP_ID` to the ID of the app.

   For example:

   ```bash
   CANVA_APP_ID=AABBccddeeff
   CANVA_APP_ORIGIN=#
   CANVA_BACKEND_PORT=3001
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_HOST=http://localhost:3001
   CANVA_HMR_ENABLED=FALSE
   ```

4. Start the app:

   ```bash
   npm start
   ```

The ID of the app must be explicitly defined because it's required to [send and verify HTTP requests](https://www.canva.dev/docs/apps/verifying-http-requests/). If you don't set up the ID in the `.env` file, an error will be thrown when attempting to run the example.

## Customizing the backend host

If your app has a backend, the URL of the server likely depends on whether it's a development or production build. For example, during development, the backend is probably running on a localhost URL, but once the app's in production, the backend needs to be exposed to the internet.

To more easily customize the URL of the server:

1. Open the `.env` file in the text editor of your choice.
2. Set the `CANVA_BACKEND_HOST` environment variable to the URL of the server.
3. When sending a request, use `BACKEND_HOST` as the base URL:

   ```ts
   const response = await fetch(`${BACKEND_HOST}/custom-route`);
   ```

   **Note:** `BACKEND_HOST` is a global constant that contains the value of the `CANVA_BACKEND_HOST` environment variable. The variable is made available to the app via webpack and does not need to be imported.

4. Before bundling the app for production, update `CANVA_BACKEND_HOST` to point to the production backend.

## Configure ngrok (optional)

If your app requires authentication with a third party service, your server needs to be exposed via a publicly available URL, so that Canva can send requests to it.
This step explains how to do this with [ngrok](https://ngrok.com/).

**Note:** ngrok is a useful tool, but it has inherent security risks, such as someone figuring out the URL of your server and accessing proprietary information. Be mindful of the risks, and if you're working as part of an organization, talk to your IT department.
You must replace ngrok urls with hosted API endpoints for production apps.

To use ngrok, you'll need to do the following:

1. Sign up for a ngrok account at <https://ngrok.com/>.
2. Locate your ngrok [authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Set an environment variable for your authtoken, using the command line. Replace `<YOUR_AUTH_TOKEN>` with your actual ngrok authtoken:

   For macOS and Linux:

   ```bash
   export NGROK_AUTHTOKEN=<YOUR_AUTH_TOKEN>
   ```

   For Windows PowerShell:

   ```shell
   $Env:NGROK_AUTHTOKEN = "<YOUR_AUTH_TOKEN>"
   ```

This environment variable is available for the current terminal session, so the command must be re-run for each new session. Alternatively, you can add the variable to your terminal's default parameters.

## 🔧 Troubleshooting

### Common Issues

#### Tests Failing
If you encounter test failures, ensure you have the latest dependencies:
```bash
npm install
npm test
```

#### Backend Connection Issues
1. Verify the backend is running on port 5001:
   ```bash
   curl http://localhost:5001/health
   ```
2. Check for CORS errors in browser console
3. Ensure Python dependencies are installed:
   ```bash
   pip3 install -r requirements.txt
   ```

#### AI Features Not Working
1. Verify your Gemini API key is set in `.env`:
   ```bash
   echo $GEMINI_API_KEY
   ```
2. Check backend logs for API errors
3. Ensure you haven't exceeded free tier limits (60 req/min)

#### Canva App Not Loading
1. Verify the development server is running on HTTPS:
   ```bash
   npm start --use-https
   ```
2. Check that the app URL matches in Canva Developer Portal
3. Ensure you've bypassed SSL certificate warnings

### Getting Help

- 📚 [Canva Apps Documentation](https://www.canva.dev/docs/apps/)
- 🤖 [Google Gemini AI Documentation](https://ai.google.dev/docs)
- 🧪 [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
