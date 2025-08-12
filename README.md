# Capstone Assistant

Capstone Assistant is an AI-powered web application designed to be a comprehensive partner for students navigating the complexities of their capstone projects. It provides assistance with coding problems, documentation, and research, all within a user-friendly chat interface.

The assistant embodies the persona of "Mr. Johnson," a seasoned Filipino IT college professor, to provide guidance that is strict, humorous, and relatable to students.

## Key Features

- **AI-Powered Chat:** Integrates with Google's Generative AI to provide intelligent and context-aware responses to user queries.
- **User Authentication:** Secure user registration and login system using NextAuth.js, allowing for personalized experiences.
- **Conversation History:** Users can save, view, and manage their past conversations with the assistant.
- **Unique Chatbot Personality:** The AI adopts the persona of a knowledgeable and experienced IT professor to make interactions more engaging and effective.
- **File Uploads:** Users can upload files to provide more context for their questions.
- **Responsive Design:** A clean and modern interface built with Tailwind CSS that works seamlessly across devices.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI:** [Google Generative AI](https://ai.google.dev/)
- **UI Components:** [React Icons](https://react-icons.github.io/react-icons/)
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-hosted on MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/CapstoneAssistantv1.git
    cd CapstoneAssistantv1
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following environment variables.

    ```env
    # MongoDB Connection String
    MONGODB_URI=your_mongodb_connection_string

    # NextAuth.js secret for JWT signing
    # Generate one here: https://generate-secret.vercel.app/32
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000

    # Google Generative AI API Key
    # Get one from Google AI Studio: https://aistudio.google.com/
    GOOGLE_API_KEY=your_google_api_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project uses the Next.js App Router structure:


## How It Works

- The **frontend** is built with React and Next.js, providing a dynamic user experience.
- The **backend** is implemented using Next.js API Routes. These routes handle user authentication, database operations, and communication with the Google Generative AI API.
- **Authentication** is managed by NextAuth.js, which creates and verifies user sessions.
- **Data** is stored in a MongoDB database, with Mongoose schemas defining the structure for users, conversations, and messages.
- The **AI Chat** functionality sends user prompts and conversation history to the Google Generative AI API via the `/api/chat` endpoint and streams the response back to the client.

---

This `README.md` should give anyone a good overview of your project. Let me know if you'd like any adjustments!
