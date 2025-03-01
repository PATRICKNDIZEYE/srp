import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const API_URL = 'http://localhost:5000/api'; // Adjust port if different

async function testMilkSubmissionStatus() {
  try {
    // 1. First create a test milk submission
    console.log('1. Creating test milk submission...');
    const createResponse = await axios.post(`${API_URL}/milk-submissions`, {
      milkType: 'inshushyu',
      amount: 10,
      notes: 'Test submission',
      farmerId: 1 // Use an existing farmer ID from your database
    });

    const submissionId = createResponse.data.id;
    console.log(`Created submission with ID: ${submissionId}`);

    // 2. Test accepting the submission
    console.log('\n2. Testing ACCEPT status...');
    await axios.put(`${API_URL}/milk-submissions/${submissionId}/status`, {
      status: 'accepted'
    });
    console.log('Successfully tested acceptance notification');

    // Wait 5 seconds before sending rejection (to space out SMS messages)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Test rejecting the submission
    console.log('\n3. Testing REJECT status...');
    await axios.put(`${API_URL}/milk-submissions/${submissionId}/status`, {
      status: 'rejected',
      reason: 'Quality standards not met'
    });
    console.log('Successfully tested rejection notification');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
console.log('Starting milk submission status test...');
testMilkSubmissionStatus(); 