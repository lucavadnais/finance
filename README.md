# Finance app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


# To test on your local network
run `ng serve --host YOUR_IP_ADDRESS --port 4200 --disable-host-check`

In the environment.ts file, change the apiUrl to your local network IP address
```typescript
export const environment = {
production: false,
apiUrl: 'http://YOUR_IP_ADDRESS:3000'
};
```
Refer to the backend README.md for more information on how to run the backend server.
