import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './src/auth/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: true,
  logging: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');

    const userRepository = AppDataSource.getRepository(User);

    // Create Admin User
    const adminExists = await userRepository.findOneBy({ email: 'admin@example.com' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
        isActive: true,
      });
      await userRepository.save(admin);
      console.log('Dummy Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    // Create Regular User
    const userExists = await userRepository.findOneBy({ email: 'user@example.com' });
    if (!userExists) {
      const userPassword = await bcrypt.hash('user123', 10);
      const regularUser = userRepository.create({
        email: 'user@example.com',
        password: userPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
      });
      await userRepository.save(regularUser);
      console.log('Dummy Regular user created: user@example.com / user123');
    } else {
      console.log('Regular user already exists.');
    }

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

seed();
