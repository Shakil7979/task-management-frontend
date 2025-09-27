# Task Manager Frontend (Vue 3 SPA + TailwindCSS)

## Project Overview

This is the **frontend SPA** for the Task Manager project.

* Built with **Vue 3** using **Vite**
* Styling with **TailwindCSS**
* **Axios** used for API requests to Laravel backend
* **Toastr** notifications for success/error messages

It works with the Laravel API to dynamically add multiple tasks without page reload.
Users can **add multiple tasks, remove tasks, and submit all tasks at once**, with validation and success/error notifications.

---

## Table of Contents

* [Setup](#setup)
* [Project Structure](#project-structure)
* [Running the Project](#running-the-project)
* [API Integration](#api-integration)
* [Notes](#notes)

---

## Setup

1. Clone repository:

```bash
git clone <frontend-repo-url>
cd task-manager-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment (optional):

* If you need to set the API URL, create `.env` file in project root:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

4. Start development server:

```bash
npm run dev
```

---

## Project Structure

```
task-manager-frontend/
├─ public/
│  └─ index.html
├─ src/
│  ├─ assets/          # Images, CSS, static assets
│  ├─ components/
│  │  └─ TaskComponent.vue  # Handles task form, repeater, and API calls
│  ├─ App.vue           # Main SPA container
│  └─ main.js           # Mounts Vue app, registers Toastr globally
├─ package.json
└─ tailwind.config.js
```

---

## Running the Project

* **Development mode (hot reload)**:

```bash
npm run dev
```

* **Production build**:

```bash
npm run build
```

---

## API Integration

* All API calls are made using **Axios**.
* Example: `POST /tasks` to add multiple tasks.
* **Validation rules:** All fields (`title`, `description`, `due_date`) are **required**.
* Invalid fields are highlighted with **red border**, and a **single Toastr message** shows “Please fill all required fields.”
* On success, Toastr shows the success message from API.

---

## Notes

* Make sure **Laravel API** is running before submitting tasks.
* TailwindCSS is used for styling, Toastr for notifications.
* Dynamic task form allows **adding/removing multiple tasks** without page reload.
* This frontend works as a **single-page application (SPA)**.
