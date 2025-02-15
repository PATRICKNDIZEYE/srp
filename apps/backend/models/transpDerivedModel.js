import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class TranspDerivedModel {
  async createTranspDerived(data) {
    return await prisma.transpDerived.create({
      data: {
        transportId: data.transportId,
        amount: data.amount,
        status: data.status,
        transportationId: data.transportationId,
        date: data.date || new Date(), // Use current date if not provided
      },
    });
  }

  async getTranspDerivedById(id) {
    const result = await prisma.transpDerived.findUnique({
      where: { id: parseInt(id) },
      include: {
        transport: true,
        transportations: {
          select: {
            id: true,
            // transpDerivedId: true, // Remove this line
            // Add valid fields from the Transportations model here
          },
        },
      },
    });

    if (!result) {
      console.log(`❌ No TranspDerived found with id ${id}`);
      return { error: "Not found" };
    }

    console.log('✅ Fetched TranspDerived:', JSON.stringify(result, null, 2));
    return result;
  }

  async updateTranspDerived(id, data) {
    return await prisma.transpDerived.update({
      where: { id: parseInt(id) },
      data: {
        transportId: data.transportId,
        amount: data.amount,
        status: data.status,
        transportationId: data.transportationId,
        date: data.date || new Date(),
      },
    });
  }

  async deleteTranspDerived(id) {
    return await prisma.transpDerived.delete({
      where: { id: parseInt(id) },
    });
  }

  async listTranspDerived() {
    const result = await prisma.transpDerived.findMany({
      include: {
        transport: true,
        transportations: {
          select: {
            id: true,
            // transpDerivedId: true, // Remove this line
            // Add valid fields from the Transportations model here
          },
        },
      },
    });

    console.log('📄 List of TranspDerived:', JSON.stringify(result, null, 2));
    return result;
  }

  async getTranspDerivedByTransportId(transportId) {
    return await prisma.transpDerived.findMany({
      where: { transportId: parseInt(transportId) },
      include: {
        transport: true,
        transportations: {
          select: {
            id: true,
            transpDerivedId: true,
          },
        },
      },
    });
  }

  async updateTranspDerivedStatus(id, status) {
    return await prisma.transpDerived.update({
      where: { id: parseInt(id) },
      data: { status },
    });
  }

  async getTranspDerivedByProductionId(productionId) {
    return await prisma.transpDerived.findMany({
      where: { productionId: parseInt(productionId) },
      include: {
        transport: true,
        transportations: {
          select: {
            id: true,
            transpDerivedId: true,
            amount: true,
            status: true,
            date: true,
          },
        },
      },
    });
  }

  async getTranspDerivedByTransportationId(transportationId) {
    return await prisma.transpDerived.findMany({
      where: { transportationId: parseInt(transportationId) },
      include: { 
        transport: true,
        transportations: {
          select: {
            id: true,
            transpDerivedId: true,
          },
        },
      },
    });
  }
}

const transpDerivedModel = new TranspDerivedModel();

export const createTranspDerived = transpDerivedModel.createTranspDerived.bind(transpDerivedModel);
export const getTranspDerivedById = transpDerivedModel.getTranspDerivedById.bind(transpDerivedModel);
export const updateTranspDerived = transpDerivedModel.updateTranspDerived.bind(transpDerivedModel);
export const deleteTranspDerived = transpDerivedModel.deleteTranspDerived.bind(transpDerivedModel);
export const listTranspDerived = transpDerivedModel.listTranspDerived.bind(transpDerivedModel);
export const getTranspDerivedByTransportId = transpDerivedModel.getTranspDerivedByTransportId.bind(transpDerivedModel);
export const updateTranspDerivedStatus = transpDerivedModel.updateTranspDerivedStatus.bind(transpDerivedModel);
export const getTranspDerivedByProductionId = transpDerivedModel.getTranspDerivedByProductionId.bind(transpDerivedModel);
export const getTranspDerivedByTransportationId = transpDerivedModel.getTranspDerivedByTransportationId.bind(transpDerivedModel);
