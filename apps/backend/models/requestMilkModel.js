import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class RequestMilkModel {
  async createRequest(data) {
    if (typeof data.amount !== 'number') {
      throw new Error("Amount must be a number");
    }

    return await prisma.requestMilk.create({
      data: {
        diaryIdFrom: data.diaryIdFrom,
        diaryIdAccept: data.diaryIdAccept,
        amount: data.amount,
        description: data.description,
        status: data.status || 'pending',
        createdAt: new Date(data.createdAt || Date.now()),
        updatedAt: new Date(data.updatedAt || Date.now()),
      },
    });
  }

  async getRequestById(id) {
    return await prisma.requestMilk.findUnique({
      where: { id: parseInt(id) },
      include: {
        diaryFrom: true,
        diaryAccept: true,
      },
    });
  }

  async updateRequest(id, data) {
    return await prisma.requestMilk.update({ where: { id: parseInt(id) }, data });
  }

  async deleteRequest(id) {
    return await prisma.requestMilk.delete({ where: { id: parseInt(id) } });
  }

  async listRequests() {
    return await prisma.requestMilk.findMany({
      include: {
        diaryFrom: true,
        diaryAccept: true,
      },
    });
  }

  async changeRequestStatus(id, status) {
    return await prisma.requestMilk.update({
      where: { id: parseInt(id) },
      data: { status },
    });
  }

  async getRequestsByDiaryIdFrom(diaryIdFrom) {
    return await prisma.requestMilk.findMany({
      where: { diaryIdFrom: parseInt(diaryIdFrom) },
      include: {
        diaryFrom: true,
        diaryAccept: true,
      },
    });
  }
}

const requestMilkModel = new RequestMilkModel();

export const createRequest = requestMilkModel.createRequest.bind(requestMilkModel);
export const getRequestById = requestMilkModel.getRequestById.bind(requestMilkModel);
export const updateRequest = requestMilkModel.updateRequest.bind(requestMilkModel);
export const deleteRequest = requestMilkModel.deleteRequest.bind(requestMilkModel);
export const listRequests = requestMilkModel.listRequests.bind(requestMilkModel);
export const changeRequestStatus = requestMilkModel.changeRequestStatus.bind(requestMilkModel);
export const getRequestsByDiaryIdFrom = requestMilkModel.getRequestsByDiaryIdFrom.bind(requestMilkModel); 