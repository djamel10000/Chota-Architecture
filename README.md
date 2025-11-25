# Chotta Architect

A professional-grade prompt engineering workbench for Google's Gemini models. Built with React, TypeScript, and Vite, this application provides a powerful interface for interacting with Gemini 2.5 and 3.0 models with advanced control over generation parameters.

[**🚀 Live Demo**](https://chotta-architect-demo-rockm.netlify.app)



## 🚀 Features

### 🧠 Core AI Capabilities
- **Multi-Model Support**: Access `Gemini 2.5 Flash`, `Gemini 3.0 Pro Preview`, and `Gemini 2.5 Flash (Thinking)`.
- **Multimodal Chat**: Seamlessly send text and images (multiple attachments supported).
- **Streaming Responses**: Real-time typewriter-style response generation.
- **Contextual History**: Maintains conversation context for natural interactions.

### ⚙️ Advanced Controls
- **System Instructions**: Define custom personas and behavior rules.
- **Parameter Tuning**:
  - **Temperature**: Control creativity (0.0 - 2.0).
  - **Top-K & Top-P**: Fine-tune vocabulary sampling.
- **Thinking Budget**: Configure token budgets (1024 - 8192) for reasoning models.
- **Search Grounding**: Toggle Google Search integration for real-time data.

### 🎨 Modern UI/UX
- **Professional Dark Mode**: Developer-focused interface with syntax highlighting.
- **Markdown Rendering**: Rich text formatting for code, tables, and lists.
- **Responsive Design**: Fully functional on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Lucide React
- **AI Integration**: Google GenAI SDK
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify, Docker support

## 🚦 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madhan-200/Chota-Architecture.git
   cd Chota-Architecture
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## 🧪 Running Tests

Run the unit test suite to verify components:
```bash
npm test
```

## 📦 Deployment

### Netlify
The project is configured for seamless deployment on Netlify.
```bash
npm run build
npx netlify deploy --prod
```

### Docker
Build and run the containerized application:
```bash
docker build -t chotta-architect .
docker run -p 80:80 chotta-architect
```

## 📄 License

MIT License
