import { prisma } from "../postgres/postgres.js";

// Create a new BiannualReport
export const createBiannualReport = async ({
  annualTargetId, 
  relevantIndicators,     
  progressAgainstTarget,   
  targetNumbersReached,   
  genderDisaggregation,   
  interventionArea,       
  budgetUsed,        
  progressUpdate,   
  challengesFaced,    
  successStories,   
  attachments,      
  biannualType,  
  image,           
  status,          
}) => {
  try {
  
    return await prisma.biannualReport.create({
      data: {
        relevantIndicators,
        progressAgainstTarget,
        targetNumbersReached,
        genderDisaggregation,
        interventionArea,
        budgetUsed,
        progressUpdate,
        challengesFaced,
        successStories,
        attachments: attachments || [], 
        image: image || null, 
        biannualType,
        status,
        annualTarget: {
          connect: {
            id: annualTargetId,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error creating BiannualReport:', error);
    throw error; // Re-throw error after logging
  }
};


export const getBiannualReportsByAnnualTargetId = async (annualTargetId) => {
  return await prisma.biannualReport.findMany({
    where: {
      annualTargetId: parseInt(annualTargetId),
    },
    include: {
      annualTarget: true, // Include the related AnnualTarget data
      // You can include other related entities as needed:
      // Example: interventionArea, if it's a related model
      // interventionArea: true,  
    },
  });
};

// Get a BiannualReport by ID
export const getBiannualReportById = async (id) => {
  return await prisma.biannualReport.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a BiannualReport by ID
export const updateBiannualReport = async (id, data) => {
  return await prisma.biannualReport.update({
    where: { id: parseInt(id) },
    data,
  });
};


export const updateBiannualReportStatus = async (id, status) => {
  try {
    return await prisma.biannualReport.update({
      where: { id: parseInt(id) },
      data: {
        status,
      },
    });
  } catch (error) {
    console.error('Error updating BiannualReport status:', error);
    throw error; 
  }
};


// Delete a BiannualReport by ID
export const deleteBiannualReport = async (id) => {
  return await prisma.biannualReport.delete({
    where: { id: parseInt(id) },
  });
};





// {
//   "annualTargetId": 1,
//   "relevantIndicators": ["Indicator1", "Indicator2"],
//   "progressAgainstTarget": 75,
//   "targetNumbersReached": 1500,
//   "genderDisaggregation": "Male",
//   "interventionArea": "District A, Sector B, Cell C",

//   "budgetUsed": 120000,
//   "progressUpdate": "The project is progressing as planned, with minor delays due to logistics.",
//   "challengesFaced": "Delays in procurement process. Mitigation: Streamlining procurement procedures.",
//   "successStories": "Increased community engagement due to outreach programs in Sector B.",
//   "attachments": [
//     "documents/financial_report.pdf",
//     "documents/project_image.jpg"
//   ],
//   "biannualType": "FIRST_HALF",
//   "image": ["images/report_image.png"],
//   "status": "Pending"
// }
