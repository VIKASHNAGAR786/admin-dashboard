# Angular Migration Setup Guide

## Quick Start

After converting from React to Angular, follow these steps to get the project running:

### Step 1: Navigate to Project Directory
```bash
cd src
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required npm packages including:
- Angular 18.x
- TypeScript 5.4.x
- Tailwind CSS 3.4.x
- RxJS 7.8.x
- date-fns 3.0.x

### Step 3: Start Development Server
```bash
npm start
```
or
```bash
ng serve
```

The application will be available at `http://localhost:4200/`

### Step 4: Login
Use the following credentials:
- **Username:** admin
- **Password:** admin123

## Project Organization

### Directory Structure

```
src/
├── app/                          # Main application code
│   ├── components/               # Angular components
│   │   ├── dashboard/            # Main dashboard
│   │   ├── login-page/           # Login page
│   │   ├── clients-table/        # Clients data table
│   │   ├── dashboard-stats/      # Stats cards
│   │   ├── client-details-dialog/# Client details modal
│   │   └── key-generator/        # Key generation form
│   ├── app.component.ts          # Root component
│   ├── app.routes.ts             # Route definitions
│   └── app.config.ts             # App configuration
│
├── services/                     # Angular services
│   ├── auth.service.ts           # Authentication logic
│   └── data.service.ts           # Data management
│
├── guards/                       # Route guards
│   └── auth.guard.ts             # Auth protection
│
├── models/                       # TypeScript interfaces
│   └── types.ts                  # Shared types
│
├── styles/                       # Global styles
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
│
├── main.ts                       # Entry point
├── index.html                    # HTML template
├── styles.css                    # Global styles
├── tsconfig.json                 # TypeScript config
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
└── tailwind.config.js            # Tailwind config
```

## Understanding the Conversion

### Key Components

1. **AppComponent** - Root component
   - Location: `src/app/app.component.ts`
   - Provides router outlet for page navigation

2. **LoginPageComponent** - Authentication
   - Location: `src/app/components/login-page/`
   - Handles user authentication
   - Sets localStorage flag on successful login

3. **DashboardComponent** - Main dashboard
   - Location: `src/app/components/dashboard/`
   - Contains tab navigation
   - Manages main application state

4. **Sub-Components**
   - DashboardStats: Shows statistics cards
   - ClientsTable: Displays client data
   - ClientDetailsDialog: Shows detailed client info
   - KeyGenerator: Form for generating access keys

### Services

1. **AuthService** - Authentication management
   - Handles login/logout
   - Manages authentication state with BehaviorSubject
   - Syncs with localStorage

2. **DataService** - Data management
   - Maintains client data
   - Manages generated keys
   - Provides observables for reactive updates

### Guards

1. **AuthGuard** - Route protection
   - Protects `/dashboard` route
   - Redirects to login if not authenticated

## Common Tasks

### Generate a New Component
```bash
ng generate component components/my-component
```

### Generate a New Service
```bash
ng generate service services/my-service
```

### Build for Production
```bash
ng build --configuration production
```

### Run Unit Tests
```bash
ng test
```

### Running with Production Build
```bash
ng build --configuration production
ng serve --configuration production
```

## Environment Configuration

### Development
- File: `environment.ts`
- API URL: `http://localhost:3000/api`
- Debug: Enabled

### Production
- File: `environment.prod.ts`
- API URL: `https://api.example.com/api`
- Debug: Disabled

## Styling

### Tailwind CSS
- Main config: `tailwind.config.js`
- Global styles: `styles.css`
- Component styles: Inline in component templates or `.css` files

### Custom CSS Classes
Available custom classes defined in `app.globals.css`:
- `.card` - Card container style
- `.btn` - Button base style
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Input field styling
- `.label` - Label styling
- `.badge` - Badge styling

## API Integration

To connect to a real backend API:

1. Update `environment.ts` and `environment.prod.ts` with your API URL
2. Modify `DataService` to make HTTP calls instead of using mock data
3. Import `HttpClientModule` in `app.config.ts`
4. Update service methods to use `HttpClient`

Example:
```typescript
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

constructor(private http: HttpClient) {}

getClients(): Observable<Client[]> {
  return this.http.get<Client[]>(`${environment.apiUrl}/clients`);
}
```

## Troubleshooting

### Port 4200 Already in Use
```bash
ng serve --port 4201
```

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
Make sure your TypeScript version matches the requirements:
```bash
npm list typescript
```

### Build Errors
Clear the build cache:
```bash
rm -rf dist
ng build
```

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. Use `OnPush` change detection strategy for components
2. Unsubscribe from observables using `takeUntil()`
3. Use `trackBy` in `*ngFor` loops for large lists
4. Lazy load components where applicable
5. Use `--aot` flag in production builds

## Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. ✅ Test login functionality
4. ✅ Verify all components work
5. ✅ Connect to real API (when ready)
6. ✅ Add unit tests
7. ✅ Deploy to production

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [date-fns Documentation](https://date-fns.org/docs/Getting%20Started)

## Support

For issues or questions:
1. Check the Angular documentation
2. Review the component code comments
3. Check browser console for errors
4. Verify all dependencies are installed

---

**Last Updated:** February 12, 2026
