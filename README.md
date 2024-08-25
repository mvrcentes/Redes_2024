# XMPP chat project

is a real-time chat application built with Next.js and XMPP (Extensible Messaging and Presence Protocol). The application allows users to communicate through individual and group chats, manage their contacts, and set their presence status. It leverages modern React libraries and tools to provide a smooth and interactive user experience.

## Features
* Real-time Messaging: Communicate with other users in real-time using the XMPP protocol.
* Group Chats: Join and participate in group conversations.
* Contact Management: Add, remove, and manage contacts easily.
* Presence Management: Set and update your online status.
* Notifications: Receive notifications for new messages, group chat invites, and contact requests.
* Authentication: Simple authentication flow to ensure secure access.

## Tech Stack 
* Next.js: A React framework for building modern web applications.
* React: A JavaScript library for building user interfaces.
* XMPP: An open-standard communications protocol for message-oriented middleware based on XML.
* Tailwind CSS: A utility-first CSS framework for styling.
* Zod: TypeScript-first schema declaration and validation library.

## Prerequisites 
Before you begin, ensure you have met the following requirements:

* Node.js: You need to have Node.js installed (version 14 or higher recommended).
* npm or yarn: You should have npm or yarn installed to manage dependencies.

## Installation 
1. Clone the repository 

2. Install dependencies 
Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

## Running the application 
To start the development server, run:
```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```


## Project Structure 
Project Structure

* `/components`: Contains reusable React components.
* `/context`: Context providers for managing global state, such as XMPP connections.
* `/pages`: Contains the Next.js pages and API routes.
* `/public`: Static assets like images and icons.
* `/styles`: Global styles and Tailwind CSS configuration.