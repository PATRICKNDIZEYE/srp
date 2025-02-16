// ... in your existing seed file

// Create super admin user
const superAdmin = await prisma.user.create({
  data: {
    username: 'superadmin',
    email: 'admin@srp.rw',
    phone: '250780000000',
    password: await bcrypt.hash('admin123', 10),
    role: 'super_admin',
    name: 'Super Admin'
  }
}); 