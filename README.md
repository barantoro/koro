# KoRo - Frontend Assessment Task

## Overview

A post management application with Vue.js 3 composition API and Vite. This application allows users to read, create, delete, and update posts using the JSON placeholder API.

**Node Version:** v21.5.9

**NPM Version:** 10.2.4

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### E2E test

```
npx cypress open
```

## Design Decisions

- **CKEditor 5**: For rich text editing capabilities, the project integrates CKEditor 5 along with the `@ckeditor/ckeditor5-vue` package, enabling users to create and edit content easily.

- **Form Validation**: VeeValidate and Yup are employed for form validation. VeeValidate offers declarative validation rules, while Yup provides schema-based validation, ensuring data integrity and user input accuracy.

- **HTTP Requests Handling**: Axios is used for making HTTP requests in the browser and Node.js environment. It provides a simple and intuitive API for sending asynchronous HTTP requests.

- **UI Components**: The project utilizes Headless UI for accessible UI components and Heroicons for high-quality SVG icons, enhancing the visual appeal and accessibility of the application.

- **SweetAlert2**: SweetAlert2 is included for its customizable and user-friendly alert modals, improving the overall user experience by providing visually appealing feedback to users.

## Additional Technologies Used

- **Cypress**: Cypress is integrated into the project for end-to-end testing. It provides a powerful and intuitive testing framework for ensuring the reliability and functionality of the application.