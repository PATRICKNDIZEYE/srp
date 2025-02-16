router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, password, role } = req.body;

    // Find nearest POC
    const nearestPOC = await prisma.pOC.findFirst({
      where: {
        status: 'active'
      },
      orderBy: {
        // Calculate distance using coordinates
        // This is a simplified version - you might want to use actual distance calculation
        longitude: 'asc'
      }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = await prisma.farmer.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        status: 'pending',
        pocId: nearestPOC?.id, // Assign to nearest POC
        // ... other fields
      }
    });

    // Send SMS to POC about new farmer registration
    if (nearestPOC?.phoneNumber) {
      await sendSMS(nearestPOC.phoneNumber, 'NEW_FARMER_REGISTRATION', [
        `${firstName} ${lastName}`,
        phoneNumber
      ]);
    }

    res.status(201).json({ 
      message: 'Registration successful. Awaiting POC approval.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 