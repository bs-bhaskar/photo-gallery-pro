# 📸 Photo Gallery Pro

A modern, responsive Photo Gallery application built using React.js, Vite, and Tailwind CSS. Browse beautiful photos, search photographers, save favourites, create collections, and explore images in a full-screen viewer.

## 🌐 Live Demo

🔗 **Live Website:** [Add Your Deployed Website URL Here]

## 📷 Screenshots


![Photo Gallery Pro](./public/1.png)

## ✨ Features

- 🖼️ **Photo Gallery** — Browse photos fetched from the Picsum Photos API.
- 🔍 **Search Photos** — Search photos by photographer name.
- ❤️ **Favourites** — Add and remove favourite photos.
- 📁 **Custom Collections** — Create and manage your own photo collections.
- ➕ **Collection Management** — Add photos to collections and manage saved collections.
- 🖥️ **Image Viewer** — Open photos in a larger viewer.
- ⌨️ **Keyboard Navigation** — Navigate between images using keyboard controls.
- 📥 **Download Photos** — Download images directly.
- 🔗 **Share Photos** — Share photos or copy their links.
- 🌙 **Dark and Light Mode** — Switch between themes.
- ↕️ **Sorting** — Sort photos according to available sorting options.
- ➕ **Load More Photos** — Load additional photos.
- ⚡ **Lazy Loading** — Load images as they enter the viewport.
- 💾 **Local Storage** — Preserve favourites, theme preferences, and collections across page reloads.
- 📱 **Responsive Design** — Designed for desktop, tablet, and mobile screens.
- ⏳ **Loading and Error States** — Display appropriate feedback while loading photos or handling errors.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Building the user interface |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| Tailwind CSS | Styling and responsive layouts |
| Picsum Photos API | Fetching photo data |
| React Hooks | Managing component state and side effects |
| useReducer | Managing favourites and collection state |
| localStorage | Persisting user preferences and saved data |
| Git & GitHub | Version control and source code hosting |
| Vercel | Deployment |

## 📂 Project Structure

```text
photo-gallery/
├── public/
├── src/
│   ├── components/
│   │   ├── Gallery.jsx
│   │   ├── PhotoCard.jsx
│   │   ├── ImageViewer.jsx
│   │   └── CollectionsPanel.jsx
│   ├── hooks/
│   │   └── collectionsReducer.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

*Note: The exact folder structure may vary depending on your implementation.*

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/bs-bhaskar/photo-gallery.git
```

### 2. Navigate to the Project Directory

```bash
cd photo-gallery-pro
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔌 API

This project uses the free Picsum Photos API to retrieve photo information.

**API endpoint:**

```text
https://picsum.photos/v2/list
```

The API provides information such as image IDs, author names, image dimensions, and image URLs.

Official API documentation:

https://picsum.photos/

## 💾 Data Persistence

The application uses browser `localStorage` to preserve selected information between sessions.

Examples include:

- Favourite photos
- Custom photo collections
- Theme preferences

Data is stored locally in the user's browser. It is not automatically synchronized between different browsers or devices.

## 📱 Responsive Design

The application is designed to provide a consistent experience across different screen sizes, including:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

## 🧠 Key Learnings

Building this project helped me practise:

- Creating reusable React components.
- Managing state with React Hooks.
- Using `useReducer` for structured state management.
- Fetching data from a REST API.
- Persisting data using `localStorage`.
- Implementing search and sorting functionality.
- Building image galleries and interactive viewers.
- Creating responsive interfaces with Tailwind CSS.
- Handling loading states and API errors.
- Organizing a React application into reusable components.
- Using Git and GitHub for version control.

## 🔮 Future Improvements

Potential improvements include:

- User authentication.
- Cloud-based photo collections.
- Backend integration with a database.
- Uploading custom photos.
- Advanced filtering options.
- Improved accessibility.
- Automated testing.
- Performance and accessibility optimization.

## 👨‍💻 Author

**Bhaskar Yogi**

- GitHub: https://github.com/bs-bhaskar
- Portfolio: [Add Your Portfolio URL]

## 📄 License

This project was created for learning and portfolio purposes.

You are welcome to explore the source code and use it as a reference for learning React development.

---

⭐ If you find this project useful, consider giving the repository a star!