import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class TransportationsModel {
  async createTransportation(data) {
    return await prisma.transportations.create({ data });
  }

  async getTransportationById(id) {
    return await prisma.transportations.findUnique({
      where: { id: parseInt(id) },
      include: {
        transport: true,
        poc: true,
      },
    });
  }

  async updateTransportation(id, data) {
    return await prisma.transportations.update({ where: { id: parseInt(id) }, data });
  }

  async deleteTransportation(id) {
    return await prisma.transportations.delete({ where: { id: parseInt(id) } });
  }

  async listTransportations() {
    return await prisma.transportations.findMany({
      include: {
        transport: true,
        poc: true,
      },
    });
  }

  async getTransportationsByPocId(pocId) {
    return await prisma.transportations.findMany({
      where: { pocId: parseInt(pocId) },
      include: {
        transport: true,
        poc: true,
      },
    });
  }

  async getTransportationsByProductionId(productionId) {
    return await prisma.transpDerived.findMany({
      where: { productionId: parseInt(productionId) },
      include: {
        transport: true,
      },
    });
  }

  async updateTransportationStatus(id, status) {
    try {
      return await prisma.transportations.update({
        where: { id: parseInt(id) },
        data: { 
          transportStatus: status 
        },
      });
    } catch (error) {
      console.error('Error updating transportation status:', error);
      throw new Error('Failed to update transportation status');
    }
  }

  async getTransportationsByTransportId(transportId) {
    return await prisma.transportations.findMany({
      where: { transportId: parseInt(transportId) },
      include: {
        transport: true,
        poc: true,
      },
    });
  }

  async getTransportationsByPhoneNumber(phoneNumber) {
    return await prisma.transportations.findMany({
      where: { phoneNumber },
    });
  }

  async getDeliveriesByPocId(pocId) {
    return await prisma.transportations.findMany({
      where: { pocId: parseInt(pocId) },
      select: {
        amount: true,
      },
    });
  }
}

const transportationsModel = new TransportationsModel();

export const createTransportation = transportationsModel.createTransportation.bind(transportationsModel);
export const getTransportationById = transportationsModel.getTransportationById.bind(transportationsModel);
export const updateTransportation = transportationsModel.updateTransportation.bind(transportationsModel);
export const deleteTransportation = transportationsModel.deleteTransportation.bind(transportationsModel);
export const listTransportations = transportationsModel.listTransportations.bind(transportationsModel);
export const getTransportationsByPocId = transportationsModel.getTransportationsByPocId.bind(transportationsModel);
export const getTransportationsByProductionId = transportationsModel.getTransportationsByProductionId.bind(transportationsModel);
export const updateTransportationStatus = transportationsModel.updateTransportationStatus.bind(transportationsModel);
export const getTransportationsByTransportId = transportationsModel.getTransportationsByTransportId.bind(transportationsModel);
export const getTransportationsByPhoneNumber = transportationsModel.getTransportationsByPhoneNumber.bind(transportationsModel);

export const getTransporterTotalVolume = async (transportId) => {
  try {
    // Get total assigned volume
    const assignedVolume = await prisma.transportations.aggregate({
      where: {
        transportId: parseInt(transportId),
        transportStatus: 'approved'
      },
      _sum: {
        amount: true
      }
    });

    // Get total delivered volume
    const deliveredVolume = await prisma.transpDerived.aggregate({
      where: {
        transportId: parseInt(transportId),
        status: 'Completed'
      },
      _sum: {
        amount: true
      }
    });

    const totalAssigned = assignedVolume._sum.amount || 0;
    const totalDelivered = deliveredVolume._sum.amount || 0;

    return {
      totalVolume: totalAssigned,
      availableVolume: totalAssigned - totalDelivered
    };
  } catch (error) {
    console.error('Error calculating transporter volumes:', error);
    throw error;
  }
};
