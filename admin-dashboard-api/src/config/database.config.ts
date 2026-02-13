export const databaseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'admin',
  database: process.env.DB_NAME || 'admin_dashboard_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../subscribers/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  dropSchema: false,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || 3600,
  },
};

export const corsConfig = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(','),
  credentials: true,
};
