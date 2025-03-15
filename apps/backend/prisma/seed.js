import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the correct order to avoid foreign key conflicts
  await prisma.requestMilk.deleteMany();
  await prisma.dailySale.deleteMany();
  await prisma.derived.deleteMany();
  await prisma.derivery.deleteMany();
  await prisma.transpDerived.deleteMany();
  await prisma.transportations.deleteMany();
  await prisma.milkSubmission.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.diary.deleteMany();
  await prisma.production.deleteMany();
  await prisma.user.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.pOC.deleteMany();

  // Create Super Admin User
  const superAdmin = await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'lionson@gmail.com',
      phone: '0787524803',
      password: await bcrypt.hash('lionson', 10),
      role: 'super_admin',
      name: 'Super Admin'
    }
  });

  // Create Manager
  const manager = await prisma.manager.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      birthday: new Date('1980-01-01'),
      nationalId: '1198080123456789',
      phoneNumber: '0787524803',
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'johndoe',
      password: await bcrypt.hash('lionson', 10),
      role: 'admin',
      status: 'active'
    }
  });

  // Create Production
  const production = await prisma.production.create({
    data: {
      status: 'active',
      approveStatus: 'approved',
      phoneNumber: '0787524803',
      password: await bcrypt.hash('lionson', 10),
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'production1'
    }
  });

  // Create Diary
  const diary1 = await prisma.diary.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      status: 'active',
      approveStatus: 'approved',
      phoneNumber: '0787524803',
      password: await bcrypt.hash('lionson', 10),
      longitude: 30.0588,
      latitude: -1.9441,
      nationalId: '1199080123456783'
    }
  });

  // Create POC
  const poc1 = await prisma.pOC.create({
    data: {
      firstName: 'Jean',
      lastName: 'Mugabo',
      birthday: new Date('1985-01-01'),
      nationalId: '1198580123456781',
      phoneNumber: '0787524803',
      password: await bcrypt.hash('lionson', 10),
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

  // Create Farmer
 

  // Create Transport
  const transport1 = await prisma.transport.create({
    data: {
      firstName: 'James',
      lastName: 'Kamanzi',
      birthday: new Date('1988-01-01'),
      nationalId: '1198880123456782',
      phoneNumber: '0787524803',
      password: await bcrypt.hash('lionson', 10),
      status: 'active',
      longitude: 30.0588,
      latitude: -1.9441,
      username: 'jameskamanzi',
      delivered: {
        vehicleType: 'truck',
        vehiclePlate: 'RAB 123 A'
      },
      pocId: poc1.id
    }
  });

  // Create Transportations
  const transportation1 = await prisma.transportations.create({
    data: {
      transportId: transport1.id,
      pocId: poc1.id,
      amount: 100,
      transportStatus: 'in_transit',
      date: new Date()
    }
  });

  // Create TranspDerived
  const transpDerived1 = await prisma.transpDerived.create({
    data: {
      transportId: transport1.id,
      amount: 100,
      status: 'pending',
      productionId: production.id,
      transportationId: transportation1.id
    }
  });

  // Create Delivery
  const delivery1 = await prisma.derivery.create({
    data: {
      transportId: transport1.id,
      productionId: production.id,
      amount: 100,
      transportStatus: 'pending'
    }
  });

  // Create Derived
  const derived1 = await prisma.derived.create({
    data: {
      diaryId: diary1.id,
      transportId: transport1.id,
      deriveryId: delivery1.id,
      amount: 100,
      status: 'pending'
    }
  });

  // Create DailySale
  const dailySale1 = await prisma.dailySale.create({
    data: {
      productType: 'milk',
      quantity: 50,
      pricePerUnit: 500,
      totalAmount: 25000,
      status: 'pending',
      diaryId: diary1.id,
      depance: 0,
      description: 'Morning sale'
    }
  });

  // Create RequestMilk
  const requestMilk1 = await prisma.requestMilk.create({
    data: {
      diaryIdFrom: diary1.id,
      diaryIdAccept: diary1.id,
      amount: 100,
      description: 'Emergency request',
      status: 'pending'
    }
  });

  console.log('Seed data created successfully!');
  console.log('\nTest Accounts:');
  console.log('Super Admin:', { email: 'lionson@gmail.com', phone: '0787524803', password: 'lionson' });
  console.log('Manager:', { phone: '0787524803', password: 'lionson' });
  console.log('Production:', { phone: '0787524803', password: 'lionson' });
  console.log('POC:', { phone: '0787524803', password: 'lionson' });
  console.log('Farmer:', { phone: '0787524803', password: 'lionson' });
  console.log('Transport:', { phone: '0787524803', password: 'lionson' });
  console.log('Diary:', { phone: '0787524803', password: 'lionson' });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 