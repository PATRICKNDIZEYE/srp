import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDailySales = async (req, res) => {
  try {
    const dailySales = await prisma.dailySale.findMany({
      include: { diary: true }
    });
    res.json(dailySales);
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDailySale = async (req, res) => {
  try {
    const { date, productType, quantity, pricePerUnit, totalAmount, diaryId, depance, description } = req.body;
    const newSale = await prisma.dailySale.create({
      data: { date, productType, quantity, pricePerUnit, totalAmount, diaryId, depance, description },
    });
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDailySale = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, productType, quantity, pricePerUnit, totalAmount, status, depance, description } = req.body;

    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'Sale ID is required for update' });
    }

    const updatedSale = await prisma.dailySale.update({
      where: { id: parseInt(id) },
      data: { date, productType, quantity, pricePerUnit, totalAmount, status, depance, description },
    });

    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDailySaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if id and status are provided
    if (!id || status === undefined) {
      return res.status(400).json({ error: 'Sale ID and status are required for update' });
    }

    const updatedSale = await prisma.dailySale.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDailySale = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dailySale.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDailySalesByDiaryId = async (req, res) => {
  try {
    const { diaryId } = req.params;
    const dailySales = await prisma.dailySale.findMany({
      where: { diaryId: parseInt(diaryId) },
      include: { diary: true }
    });
    res.json(dailySales);
  } catch (error) {
    console.error('Error fetching daily sales by diaryId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 