export const databaseConfig = {
  type: 'sqlite' as const,
  database: process.env.DB_DATABASE || 'database.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../subscribers/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  dropSchema: false,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || '7fK9$zQ!mL2@vX8*pR6^TnA1&dW4*YhC0uJxS5eB3gHq9LkZ!M2rV8pN6tF4',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || 3600,
  },
};

export const corsConfig = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:57882').split(','),
  credentials: true,
};
