import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import { prisma } from "../postgres/postgres.js";

// Create a new NGO
export const createNGO = async ({
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
                                    status = 'PENDING', // Add default status
                                }) => {
    const saltRounds = 10;

    try {
        // Additional validation
        if (!password || typeof password !== 'string') {
            throw new Error('Valid password is required');
        }

        // Log incoming data for debugging
        console.log('Creating NGO with data:', {
            nameOfTheNGO,
            contactPersonsEmail,
            hasPassword: !!password,
            passwordType: typeof password
        });

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the NGO with all required fields
        const ngo = await prisma.NGO.create({
            data: {
                nameOfTheNGO,
                physicalAddress,
                operationalAddress,
                domainsOfIntervention: Array.isArray(domainsOfIntervention) ? domainsOfIntervention : [],
                descriptionOfInterventions,
                district,
                sectors: Array.isArray(sectors) ? sectors : [],
                cells: Array.isArray(cells) ? cells : [],
                targetGroups: Array.isArray(targetGroups) ? targetGroups : [],
                targetedNumberOfBeneficiaries: Number(targetedNumberOfBeneficiaries),
                numberOfStaffCommunityFacilitators: Number(numberOfStaffCommunityFacilitators),
                numberOfTrainedStaffCommunityFacilitators: Number(numberOfTrainedStaffCommunityFacilitators),
                typesOfTrainingProvided,
                resources,
                annualEstimatedBudget: Number(annualEstimatedBudget),
                sourceOfFunding,
                nameOfLegalRepresentatives,
                nameOfContactPersons,
                telForContactPersons,
                contactPersonsEmail,
                password: hashedPassword,
                supportingDocuments: Array.isArray(supportingDocuments) ? supportingDocuments : [],
                status,
            },
        });

        // Log the created NGO
        console.log('NGO created with ID:', ngo.id, 'Email:', ngo.contactPersonsEmail);

        return ngo;
    } catch (error) {
        console.error('Error creating NGO:', {
            message: error.message,
            stack: error.stack,
            data: {
                hasPassword: !!password,
                passwordType: typeof password,
            }
        });

        // Throw more specific error messages
        if (!password) {
            throw new Error('Password is required for NGO registration');
        }
        if (error.code === 'P2002') {
            throw new Error('An NGO with this email already exists');
        }

        throw error;
    }
};

// Get all NGOs
export const getNGOs = async () => {
    if (!prisma.NGO) {
        throw new Error("NGO model is not properly initialized.");
    }
    return await prisma.NGO.findMany();  // Correct model name (case-sensitive)
};

// Get an NGO by ID
export const getNGOById = async (id) => {
    return await prisma.NGO.findUnique({
        where: { id: parseInt(id) },
    });
};

// Update an NGO by ID
export const updateNGO = async (id, data) => {
    if (data.password) {

        data.password = await bcrypt.hash(data.password, 10);
    }
    return await prisma.NGO.update({
        where: { id: parseInt(id) },
        data,
    });
};

// Update the status of an NGO by ID
export const updateNGOStatus = async (id, status) => {
    return await prisma.NGO.update({
        where: { id: parseInt(id) },
        data: { status },
    });
};

// Delete an NGO by ID
export const deleteNGO = async (id) => {
    return await prisma.NGO.delete({
        where: { id: parseInt(id) },
    });
};





