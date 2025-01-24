import { prisma } from "../postgres/postgres.js";

// Create a new AnnualTarget
export const createAnnualTarget = async ({
                                           organizationName, // NGO ID (this is an integer)
                                           activityName,
                                           activityDescription,
                                           areaOfInterventions, // Array of areaOfIntervention objects
                                           targetForSelectedIndicator,
                                           targetedBeneficiaries,
                                           targetNumbers,
                                           genderDisaggregation,
                                           district,
                                           sector,
                                           cell,
                                           plannedBudget,
                                           startDate,
                                           endDate,
                                         }) => {
  try {
    // Create the AnnualTarget
    return await prisma.annualTarget.create({
      data: {
        activityName,
        activityDescription,
        targetForSelectedIndicator,
        targetedBeneficiaries,
        targetNumbers,
        genderDisaggregation,
        plannedBudget,
        startDate: new Date(startDate),
        endDate: new Date(endDate),

        // Connect to the existing NGO by its ID
        NGO: {
          connect: {
            id: organizationName,
          },
        },

        // Connect or Create the InterventionArea
        interventionArea: {
          connectOrCreate: {
            where: {
              district_sector_cell: {
                district,
                sector,
                cell,
              },
            },
            create: {
              district,
              sector,
              cell,
            },
          },
        },

        areaOfInterventions: {
          create: areaOfInterventions.map((area) => ({
            areaOfIntervention: area.areaOfIntervention,
            relevantIndicators: area.relevantIndicators,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error creating AnnualTarget:", error);
    throw error; // Re-throw error after logging
  }
};

// Get Annual Targets by NGO ID
export const getAnnualTargets = async (ngoId) => {
  return await prisma.annualTarget.findMany({
    where: {
      organizationName: parseInt(ngoId), // Ensure the NGO ID is parsed to an integer
    },
    include: {
      areaOfInterventions: true,
      interventionArea: true,
      NGO: true, // Include the NGO information as well
    },
  });
};

// Get Annual Target by ID
export const getAnnualTargetById = async (id) => {
  return await prisma.annualTarget.findUnique({
    where: { id: parseInt(id) },
    include: {
      areaOfInterventions: true,
      interventionArea: true,
      NGO: true, // Include the NGO information
    },
  });
};

export const updateAnnualTarget = async (id, data) => {
  const { areaOfInterventions, ...otherData } = data;


  const existingAreas = await prisma.areaOfIntervention.findMany({
    where: {
      areaOfIntervention: { in: areaOfInterventions.map(area => area.areaOfIntervention) },
    },
  });

  return await prisma.annualTarget.update({
    where: { id: parseInt(id) },
    data: {
      ...otherData,
      areaOfInterventions: {
        upsert: areaOfInterventions.map((area) => {
          const existingArea = existingAreas.find((existing) => existing.areaOfIntervention === area.areaOfIntervention);

          return {
            where: {
              id: existingArea ? existingArea.id : -1,
            },
            create: {
              areaOfIntervention: area.areaOfIntervention,
              relevantIndicators: area.relevantIndicators,
            },
            update: {
              relevantIndicators: area.relevantIndicators,
            },
          };
        }),
      },
    },
  });
};


// Get an AnnualTarget by ID and NGO ID
export const getAnnualTargetByIdAndNgo = async (ngoId, targetId) => {
  return await prisma.annualTarget.findFirst({
    where: {
      id: parseInt(targetId),
      organizationName: parseInt(ngoId),
    },
    include: {
      areaOfInterventions: true,
      interventionArea: true,
      NGO: true, // Include the NGO information
    },
  });
};

// Delete an AnnualTarget by ID
export const deleteAnnualTarget = async (id) => {
  return await prisma.annualTarget.delete({
    where: { id: parseInt(id) },
  });
};

