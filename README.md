# KoRo - Frontend Assessment Task

[![Product Screen Shot][product-screenshot]](https://github.com/barantoro/koro.git)

[product-screenshot]: ./app-screenshot.png

A post management application with Vue.js 3 composition API and Vite. This application allows users to read, create, delete, and update posts using the JSON placeholder API. Demo hosted at [Github Pages](https://barantoro.github.io/koro/)

## Vue 3 + Vite

The application uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

## Prerequisites

* npm

  ```sh
  npm install npm@latest -g
  ```

## Installation

1. Clone the repo

   ```sh
   git clone https://github.com/barantoro/koro.git
   ```
2. Install NPM packages

   ```sh
   npm install
   ```

## Run the Project

1. Compiles and hot-reloads for development

   ```sh
   npm run dev
   ```
2. Compiles and minifies for production

   ```sh
   npm npm run build
   ```
## Other Commands

1. Testing

   ```sh
   npx cypress open
   ```
2. New deployment to Github Pages

   ```sh
   npm run deploy
   ```

## Design Decisions

- **CKEditor 5**: For rich text editing capabilities, the project integrates CKEditor 5 along with the `@ckeditor/ckeditor5-vue` package, enabling users to create and edit content easily.

- **Form Validation**: VeeValidate and Yup are employed for form validation. VeeValidate offers declarative validation rules, while Yup provides schema-based validation, ensuring data integrity and user input accuracy.

- **HTTP Requests Handling**: Axios is used for making HTTP requests in the browser and Node.js environment. It provides a simple and intuitive API for sending asynchronous HTTP requests.

- **UI Components**: The project utilizes Headless UI for accessible UI components and Heroicons for high-quality SVG icons, enhancing the visual appeal and accessibility of the application.

- **SweetAlert2**: SweetAlert2 is included for its customizable and user-friendly alert modals, improving the overall user experience by providing visually appealing feedback to users.

- **Vue Content Placeholders**: Vue Content Placeholders is integrated into the project to enhance the user experience by providing placeholder loading animations for content while data is being fetched from the server.

## Additional Technologies Used

- **Cypress**: Cypress is integrated into the project for end-to-end testing. It provides a powerful and intuitive testing framework for ensuring the reliability and functionality of the application.

## Development Notes

- **Testing**: This was my first time testing in the frontend. Everything went smoothly until I tried typing something into CKEditor. `cy.type()` simply did not work. Here's a releated topic on [GitHub](https://github.com/cypress-io/cypress/issues/2615/) 

- **Error Handling**: While I have implemented basic error handling in this application, with more time, I would enhance it to provide more informative error messages to the user and implement a more robust error handling strategy.

