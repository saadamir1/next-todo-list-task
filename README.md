# Product Catalog Task

A very basic product catalog application built with Next.js that displays product data from the Fake Store API. This simple demo was created as part of a lab assignment.

## Features

- Fetches real product data from Fake Store API
- Responsive grid layout for product listings
- Detailed product view with descriptions
- Dark mode support
- Clean, modern UI

## Technologies Used

- Next.js
- SWR for data fetching
- React Hooks
- Tailwind CSS
- Lucide React for icons

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/saadamir1/product-catalog-task.git
   ```

2. Install dependencies:
   ```
   cd product-catalog-task
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `/api/products` - Fetches all products
- `/api/products/[id]` - Fetches a single product by ID

This project is a very basic implementation intended only as a simple lab task demonstration. It lacks many features that would be necessary in a production application, such as error boundaries, comprehensive testing, and proper state management.