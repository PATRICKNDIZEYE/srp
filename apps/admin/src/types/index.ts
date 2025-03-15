export interface NGO {
  id: number;
  nameOfTheNGO: string;
  physicalAddress: string;
  operationalAddress: string;
  domainsOfIntervention: string[];
  descriptionOfInterventions: string;
  district: string;
  sectors: string[];
  cells: string[];
  targetGroups: string[];
  targetedNumberOfBeneficiaries: number;
  numberOfStaffCommunityFacilitators: number;
  numberOfTrainedStaffCommunityFacilitators: number;
  typesOfTrainingProvided: string[];
  resources: string[];
  annualEstimatedBudget: number;
  sourceOfFunding: string;
  nameOfLegalRepresentatives: string;
  nameOfContactPersons: string;
  telForContactPersons: string;
  contactPersonsEmail: string;
  status: 'pending' | 'approved' | 'declined';
  supportingDocuments: string[];
  annualTargets?: AnnualTarget[];
  submissionDate: string;
}

export interface AnnualTarget {
  id: number;
  organizationName: number;
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  relevantIndicators: string;
  targetForSelectedIndicator: string;
  targetedBeneficiaries: string;
  targetNumbers: number;
  genderDisaggregation: GenderDisaggregation;
  district: string;
  sector: string;
  cell: string;
  plannedBudget: number;
  startDate: Date;
  endDate: Date;
}

export enum GenderDisaggregation {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
}

export interface MilkSubmission {
  id: number;
  milkType: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  farmerId: number;
  farmer: {
    id: number;
    firstName: string;
    lastName: string;
    birthday: string;
    nationalId: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    username: string;
    password: string;
    farmDetails: {
      size: string;
      type: string;
    };
    status: string;
    pocId: number | null;
  };
}

export interface Stock {
  id?: string;
  product: string;
  quantity: number;
} 