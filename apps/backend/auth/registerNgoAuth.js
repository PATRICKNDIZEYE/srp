import bcrypt from 'bcryptjs';
import { prisma } from '../postgres/postgres.js';

// Register a new NGO
export const registerNgoAuth = async ({
                                        nameOfTheNGO,
                                        physicalAddress,
                                        operationalAddress,
                                        domainsOfIntervention,
                                        descriptionOfInterventions,
                                        district,
                                        sectors,
                                        cells,
                                        targetGroups,
                                        targetedNumberOfBeneficiaries,
                                        numberOfStaffCommunityFacilitators,
                                        numberOfTrainedStaffCommunityFacilitators,
                                        typesOfTrainingProvided,
                                        resources,
                                        annualEstimatedBudget,
                                        sourceOfFunding,
                                        nameOfLegalRepresentatives,
                                        nameOfContactPersons,
                                        telForContactPersons,
                                        contactPersonsEmail,
                                        password,
                                        supportingDocuments,
                                        status,
                                      }) => {

  const existingNgo = await prisma.NGO.findUnique({
    where: { contactPersonsEmail },
  });

  if (existingNgo) {
    throw new Error('NGO with this contact person email already exists.');
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const newNgo = await prisma.NGO.create({
    data: {
      nameOfTheNGO,
      physicalAddress,
      operationalAddress,
      domainsOfIntervention,
      descriptionOfInterventions,
      district,
      sectors,
      cells,
      targetGroups,
      targetedNumberOfBeneficiaries,
      numberOfStaffCommunityFacilitators,
      numberOfTrainedStaffCommunityFacilitators,
      typesOfTrainingProvided,
      resources,
      annualEstimatedBudget,
      sourceOfFunding,
      nameOfLegalRepresentatives,
      nameOfContactPersons,
      telForContactPersons,
      contactPersonsEmail,
      password: hashedPassword,
      supportingDocuments,
      status,
    },
  });

  return newNgo;
};
