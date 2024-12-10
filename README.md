# DevZero @ KubeCon 2024

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Development of this project has greatly benefitted from [V0](https://v0.dev).

![Screenshot of the webapp](frame.png)

## Getting Started

First, run the development server:

```bash
yarn dev
# and/or
yarn build # && yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

This project is run entirely on [DevZero](https://devzero.io). 
It uses the following components:
1. Docker (on DevZero), to host a MongoDB database
 - `docker run --name mongodb -e MONGO_INITDB_DATABASE=admin -e MONGO_INITDB_ROOT_USERNAME=my-root-user -e MONGO_INITDB_ROOT_PASSWORD=verymongodbpassword -p 27017:27017 -d mongodb/mongodb-community-server:8.0-ubuntu2204`
 - Resulting URI for `MONGODB_URI` env var in `.env.local`: `mongodb://my-root-user:verymongodbpassword@localhost:27017`
2. DevZero Object Storage (S3-compatible API)
 - See [these docs](https://www.devzero.io/docs/devzero-storage/object-storage)
3. Node.js etc to run the main application
4. OpenAI key for image description and image generation
5. Resend API key for sending emails.
6. `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` to view the `/admin` page.
7. `dz net funnel` to expose the app to the public internet.

## KubeCon 2024 - Salt Lake City, UT, USA

During the conference (and maybe after?), this app will be available at https://worthy-yak-jiit.team-03f3f9b48aa3465ca-9f8c8bfece3b44ac97103ab79e495aa0.dv0.io
