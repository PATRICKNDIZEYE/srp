import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const API_URL = 'http://localhost:2025/api'; // Changed to 4000 - adjust if different

// Function to test status change
async function testStatusChange(submissionId, newStatus, reason = '') {
  try {
    console.log(`Testing ${newStatus.toUpperCase()} status for submission ${submissionId}...`);
    
    // First verify the submission exists
    let submission;
    try {
      const checkResponse = await axios.get(`${API_URL}/milk-submissions/${submissionId}`);
      submission = checkResponse.data;
      console.log('Found submission:', submission);
      console.log('\nFarmer phone number:', submission.farmer.phoneNumber);
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('Submission not found. Please check the ID.');
        return;
      }
      throw error;
    }
    
    // Update the status
    console.log('\nSending status update request...');
    const response = await axios.put(`${API_URL}/milk-submissions/${submissionId}/status`, {
      status: newStatus,
      reason: reason
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\nResponse:', response.data);
    console.log(`\nSuccessfully changed status to ${newStatus}`);
    
    // Check SMS environment variables
    console.log('\nSMS Configuration:');
    console.log('SMS Username exists:', !!process.env.FDI_SMS_USERNAME);
    console.log('SMS Password exists:', !!process.env.FDI_SMS_PASSWORD);
    console.log('SMS Sender ID exists:', !!process.env.FDI_SMS_SENDER_ID);
    
    if (submission.farmer?.phoneNumber) {
      console.log(`\nSMS should be sent to: ${submission.farmer.phoneNumber}`);
      console.log('Message content:');
      if (newStatus === 'accepted') {
        console.log(`Murakoze! Amata ${submission.amount}L (${submission.milkType}) yemejwe. ` +
          `Amafaranga ${submission.amount * 300} RWF azishyurwa mu gihe giteganyijwe.`);
      } else if (newStatus === 'rejected') {
        console.log(`Amata ${submission.amount}L (${submission.milkType}) ntiyemewe. ` +
          `Impamvu: ${reason}. Murakoze.`);
      }
    } else {
      console.log('\nNo phone number found for farmer');
    }
  } catch (error) {
    console.error('\nError occurred:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
      console.error('Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

// Get submission ID from command line argument
const submissionId = process.argv[2];
const status = process.argv[3] || 'accepted';
const reason = process.argv[4] || '';

if (!submissionId) {
  console.error('Please provide a submission ID');
  console.log('Usage: node testStatusChange.js <submissionId> [status] [reason]');
  console.log('Example: node testStatusChange.js 123 rejected "Poor quality"');
  process.exit(1);
}

console.log('\nStarting test...');
console.log('API URL:', API_URL);
console.log('Submission ID:', submissionId);
console.log('New Status:', status);
console.log('Reason:', reason || 'None provided');
console.log('-------------------\n');

testStatusChange(submissionId, status, reason); 