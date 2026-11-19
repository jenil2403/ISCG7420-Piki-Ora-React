# Piki Ora Medical Centre

React frontend for the clinic appointment system. It is written in JavaScript and talks to the Django REST API with Axios.

Staff use the dashboard inside this site. Patients use the same login page, then see doctors and their own visits.

## Run it locally

The API has to be running first, usually at http://127.0.0.1:8000.

```powershell
npm install
npm run dev
```

Open http://localhost:5173

| Who | Username | Password |
| --- | --- | --- |
| Staff | admin | Admin12345 |
| Patient | avery | Patient12345 |

`VITE_API_URL` in `.env` is the API address. For a normal local run leave it as `http://127.0.0.1:8000`.

## What the pages do

- `src/api.js` creates the Axios client and adds the token to each request
- `src/AuthContext.jsx` remembers who is logged in
- `src/components/Navbar.jsx` shows patient links or staff links
- `src/pages/BookPage.jsx` loads free times and posts a booking
- `src/pages/AdminHome.jsx` and the other Admin pages are the staff dashboard

After login the token is kept in `localStorage`. Logout deletes it and calls `/api/logout/`.

## Deploy on Render

1. Push this repo to a public GitHub repository.
2. Deploy the Django API first and copy its URL, for example `https://piki-ora-api.onrender.com`.
3. In Render, New, Static Site, connect this repo.
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Add an environment variable before the build:

```text
VITE_API_URL=https://your-api-name.onrender.com
```

Do not put a slash at the end.

7. Add a rewrite so refreshing a page still works:

- Source: `/*`
- Destination: `/index.html`
- Action: Rewrite

Vite reads `VITE_API_URL` when it builds, so if you change the API address you need to redeploy this site.
