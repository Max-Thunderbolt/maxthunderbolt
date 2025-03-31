# ThunderAI

This is an Angular-based AI assistant application with Firebase integration. The application uses Angular 19 and provides a chatbot interface along with CV analysis capabilities.

## Project Overview

ThunderAI is designed to provide intelligent assistance through:
- Chat-based AI interface
- CV analysis and processing
- User authentication and profiles
- Dashboard for user activity

## Prerequisites

- Node.js (18.x or later)
- Angular CLI (v19.x)
- Firebase account

## Installation

```bash
# Clone the repository
git clone https://github.com/Max-Thunderbolt/maxthunderbolt.git

# Navigate to the project directory
cd maxthunderbolt

# Install dependencies
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Firebase Configuration

This project uses Firebase for authentication, hosting, and database services. Make sure to:

1. Create a Firebase project
2. Configure your Firebase credentials in the environment files
3. Enable authentication methods as needed

## Deployment

The project is configured for Firebase hosting. To deploy:

```bash
# Build the project for production
ng build

# Deploy to Firebase
firebase deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
