# 3D Printed Parts — Ecommerce Starter

A responsive, static storefront starter for GitHub + Cloudflare Pages. It uses plain HTML, CSS, and JavaScript, so there is no build step and no framework to install.

> **Important:** The store name is “3D Printed Parts”, while the sample catalog is clothing and fashion, as requested. Replace the demo products with your real inventory before launching.

## What's included

- Responsive storefront for mobile and desktop
- Product grid, category filters, and search
- Add-to-cart, quantity controls, remove item, subtotal
- WhatsApp checkout that drafts an order message
- Editable product catalog in `script.js`
- No dependencies or build tools

## Before publishing

1. Open `script.js`.
2. Change `WHATSAPP_NUMBER` from `91XXXXXXXXXX` to your WhatsApp number using digits only, including country code. Example format: `919876543210`. Do not include `+`, spaces, or dashes.
3. Edit the `PRODUCTS` array to update product names, categories, prices (INR), descriptions, emoji placeholders, colors, and tags.
4. Replace emoji product illustrations with real product photos if desired. The current emoji illustrations are only visual placeholders.
5. Update the title, description, store text, contact details, and policies in `index.html`.
6. Test checkout on your phone before sharing the site.

## Run it locally

You can open `index.html` directly in a browser. For a more realistic local test, use any simple local static server, but no server is required for deployment.

## Publish using GitHub + Cloudflare Pages

### A. Upload the files to GitHub

1. Sign in or create a GitHub account at https://github.com/.
2. Create a new repository, for example `3d-printed-parts-store`.
3. Choose **Public** or **Private** as you prefer. A public repository is simplest for a starter project.
4. Use **Add file → Upload files** and upload `index.html`, `styles.css`, `script.js`, and `README.md` from this folder. Make sure `index.html` is at the repository root, not inside an extra nested folder.
5. Commit the uploaded files.

### B. Deploy on Cloudflare Pages

1. Sign in or create a Cloudflare account at https://dash.cloudflare.com/.
2. Open **Workers & Pages** (the menu label may vary), then choose **Create** and **Pages**.
3. Select **Connect to Git** and authorize GitHub.
4. Select the repository you just created.
5. For this plain HTML/CSS/JS project, set:
   - **Framework preset:** None
   - **Build command:** leave blank
   - **Build output directory:** `/` or the repository root, depending on the dashboard's accepted value
6. Start deployment. Cloudflare will provide a URL ending in `pages.dev`.
7. Open that URL on a phone and test product filters, cart, and WhatsApp checkout.

Official Cloudflare Pages Git integration guide:
https://developers.cloudflare.com/pages/configuration/git-integration/

If the dashboard does not accept `/` as the output directory, use the root directory option shown by the current Cloudflare UI. Because this project has no build step, do not run a build command.

## How WhatsApp checkout works

- A customer adds items to their cart and selects **Order on WhatsApp**.
- The site opens WhatsApp with a prefilled message containing product names, quantities, and subtotal.
- The customer sends that message, then you confirm stock, shipping charges, delivery address, and payment method in the chat.
- The website does **not** automatically collect payment, reserve stock, create shipping labels, or save orders to a database.
- The cart exists only in the customer's current browser session and clears on page reload.

## Important production notes

- This is a front-end starter, not a full ecommerce backend.
- No payment gateway is connected. UPI/COD can be arranged with the customer manually, but online payment integration requires a separate provider setup.
- Shipping fees and taxes are not calculated in the sample. Confirm your legal, tax, privacy, refund, and delivery obligations before selling.
- Do not add payment secrets, API keys, or private credentials to client-side JavaScript or a public GitHub repository.
- GitHub Pages is not intended for ecommerce/business use under its published terms. Use GitHub as the code repository and Cloudflare Pages as the hosting platform for this storefront.
