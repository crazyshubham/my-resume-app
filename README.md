# SkillScraper

A modern Next.js + Firebase starter for extracting and visualizing key skills from uploaded resumes. Built with TypeScript, Tailwind CSS, shadcn/ui, and GenKit for AI-powered skill parsing.

---

## 📋 Table of Contents

1. [Demo](#-demo)  
2. [Features](#-features)  
3. [Tech Stack](#-tech-stack)  
4. [Prerequisites](#-prerequisites)  
5. [Getting Started](#-getting-started)  
   - [1. Clone the Repo](#1-clone-the-repo)  
   - [2. Install Dependencies](#2-install-dependencies)  
   - [3. Configure Environment](#3-configure-environment)  
   - [4. Run Locally](#4-run-locally)  
6. [Development with Nix](#-development-with-nix)  
7. [Building & Production](#-building--production)  
8. [Project Structure](#-project-structure)  
9. [Contributing](#-contributing)  
10. [License](#-license)  
11. [Contact](#-contact)  

---

## 🚀 Demo

> _Link to live demo (if deployed)_  
> https://your-domain.com

---

## ✨ Features

- **Resume Upload**: PDF or text file upload.  
- **AI-Powered Skill Extraction**: Leverages an external API (via GenKit) to parse and extract skills.  
- **Skill Tags**: Displays parsed skills as interactive, styled chips.  
- **Clean UI**: Built with Tailwind CSS and shadcn/ui for consistent components.  
- **Responsive**: Mobile-friendly layouts and accessible design.  

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)  
- **Styling**: Tailwind CSS + Tailwind Animations  
- **Components**: shadcn/ui (Radix + Tailwind)  
- **State & Forms**: React Hook Form + Zod Validators  
- **AI Integration**: GenKit (`@genkit-ai/next`, `@genkit-ai/googleai`)  
- **Charts**: Recharts  
- **Serverless Backend**: Firebase Authentication & Firestore (optional)  
- **Dev Environment**: Nix (`.idx/dev.nix`)  

---

## 🔧 Prerequisites

- Node.js ≥ 20  
- npm or yarn  
- (Optional) Nix & direnv  

---

## 🏁 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/skill-scraper.git
cd skill-scraper
```

### 2. Install Dependencies

Using npm:
\`\`\`bash
npm install
\`\`\`
Or with yarn:
\`\`\`bash
yarn
\`\`\`

### 3. Configure Environment

Create a \`.env.local\` at project root and add:

\`\`\`bash
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# GenKit / AI API
GENKIT_API_KEY=your_genkit_api_key
\`\`\`

> _You can find sample variables in \`docs/blueprint.md\` and configure via Firebase Console._  

### 4. Run Locally

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Development with Nix

This repo includes a \`dev.nix\` for reproducible environments:

1. Install [Nix](https://nixos.org/download.html).  
2. Enter the shell:
   \`\`\`bash
   nix develop
   \`\`\`
3. \`npm install\` (or \`yarn\`) and \`npm run dev\` as usual.

---

## 📦 Building & Production

Build the optimized production bundle:

\`\`\`bash
npm run build
npm run start
\`\`\`

Consider using Vercel or Firebase Hosting for zero-config deployments.

---

## 📂 Project Structure

\`\`\`
/
├── .vscode/           # Editor settings
├── docs/              # Design blueprints, specs
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # UI & layout components
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions
├── public/            # Static assets
├── .idx/dev.nix       # Nix environment
├── next.config.ts     # Next.js settings
├── tailwind.config.ts # Tailwind CSS config
├── package.json       # Scripts & dependencies
└── README.md          # ← You are here
\`\`\`

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: \`git checkout -b feat/YourFeature\`  
3. Commit your changes: \`git commit -m "feat: add YourFeature"\`  
4. Push to your branch: \`git push origin feat/YourFeature\`  
5. Open a Pull Request  

Please make sure to run linting and type checks before submitting.

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

## 📬 Contact

- **Author**: Your Name – [@yourhandle](https://twitter.com/yourhandle)  
- **Repo**: [github.com/yourusername/skill-scraper](https://github.com/yourusername/skill-scraper)  

Feel free to open issues or discussion threads for questions and feature requests. Happy coding! 🚀
