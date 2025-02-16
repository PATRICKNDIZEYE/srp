import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the correct order
  await prisma.milkSubmission.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.diary.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pOC.deleteMany();

  // Create Manager User (Super Admin)
  const manager = await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'admin@srp.rw',
      phone: '250780000000',
      password: await bcrypt.hash('admin123', 10),
      role: 'super_admin',
      name: 'Super Admin'
    }
  });

  // Create Diary
  const diary1 = await prisma.diary.create({
    data: {
      status: 'active',
      approveStatus: 'approved',
      phoneNumber: '250780000006',
      password: await bcrypt.hash('password123', 10),
      longitude: 30.0588,
      latitude: -1.9441
    }
  });

  // Create POCs
  const poc1 = await prisma.pOC.create({
    data: {
      firstName: 'Jean',
      lastName: 'Mugabo',
      birthday: new Date('1985-01-01'),
      nationalId: '1198580123456781',
      phoneNumber: '250780000001',
      password: await bcrypt.hash('password123', 10),
      status: 'active',
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'jeanmugabo',
      address: {
        district: 'Nyarugenge',
        sector: 'Muhima',
        cell: 'Kabeza'
      }
    }
  });

  // Create Farmers
  const farmer1 = await prisma.farmer.create({
    data: {
      firstName: 'Paul',
      lastName: 'Kagame',
      birthday: new Date('1990-01-01'),
      nationalId: '1199080012345678',
      phoneNumber: '250780000003',
      password: await bcrypt.hash('password123', 10),
      status: 'active',
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'paulkagame',
      farmDetails: {
        size: '2 hectares',
        cowCount: 5,
        farmType: 'dairy'
      },
      pocId: poc1.id
    }
  });

  // Create Transport
  const transport1 = await prisma.transport.create({
    data: {
      firstName: 'James',
      lastName: 'Kamanzi',
      birthday: new Date('1988-01-01'),
      nationalId: '1198880123456782',
      phoneNumber: '250780000005',
      password: await bcrypt.hash('password123', 10),
      status: 'active',
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'jameskamanzi',
      delivered: {
        vehicleType: 'truck',
        vehiclePlate: 'RAB 123 A'
      }
    }
  });

  // Create Milk Submissions
  const milkSubmission1 = await prisma.milkSubmission.create({
    data: {
      milkType: 'inshushyu',
      amount: 10.5,
      notes: 'Morning submission',
      status: 'pending',
      farmerId: farmer1.id
    }
  });

  // Create Loans
  const loan1 = await prisma.loan.create({
    data: {
      loanAmount: 50000,
      purpose: 'Buy more cows',
      status: 'PENDING',
      farmerId: farmer1.id
    }
  });

  // Create Stock
  const stock1 = await prisma.stock.create({
    data: {
      name: 'Morning Collection',
      data: {
        quality: 'A',
        temperature: '4°C'
      },
      productType: 'raw_milk',
      quantity: 100,
      farmerId: farmer1.id
    }
  });

  console.log('Seed data created successfully!');
  console.log('\nTest Accounts:');
  console.log('Super Admin:', { email: 'admin@srp.rw', phone: '250780000000', password: 'admin123' });
  console.log('POC:', { phone: '250780000001', password: 'password123' });
  console.log('Farmer:', { phone: '250780000003', password: 'password123' });
  console.log('Transport:', { phone: '250780000005', password: 'password123' });
  console.log('Diary:', { phone: '250780000006', password: 'password123' });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 