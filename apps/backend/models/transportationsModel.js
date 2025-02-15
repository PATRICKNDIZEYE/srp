import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class TransportationsModel {
  async createTransportation(data) {
    return await prisma.transportations.create({ data });
  }

  async getTransportationById(id) {
    return await prisma.transportations.findUnique({ where: { id: parseInt(id) } });
  }

  async updateTransportation(id, data) {
    return await prisma.transportations.update({ where: { id: parseInt(id) }, data });
  }

  async deleteTransportation(id) {
    return await prisma.transportations.delete({ where: { id: parseInt(id) } });
  }

  async listTransportations() {
    return await prisma.transportations.findMany();
  }

  async getTransportationsByPocId(pocId) {
    return await prisma.transportations.findMany({
      where: { pocId: parseInt(pocId) },
    });
  }

  async getTransportationsByProductionId(productionId) {
    return await prisma.transpDerived.findMany({
      where: { productionId: parseInt(productionId) },
      include: {
        transport: true,
      }
    });
  }

  async updateTransportationStatus(id, transportStatus) {
    return await prisma.transportations.update({
      where: { id: parseInt(id) },
      data: { transportStatus },
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
