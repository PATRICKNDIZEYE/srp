const axios = require('axios');
const { format } = require('date-fns');

class MilkSubmissionSmsService {
  static AUTH_URL = "https://messaging.fdibiz.com/api/v1/auth/";
  static SMS_URL = "https://messaging.fdibiz.com/api/v1/mt/single";
  static tokenCache = null;

  static SMS_TEMPLATES = {
    SUBMISSION_ACCEPTED: (amount, milkType, price) => 
      `Murakoze! Amata ${amount}L (${milkType}) yemejwe. Amafaranga ${price} RWF azishyurwa mu gihe giteganyijwe.`,
    
    SUBMISSION_REJECTED: (amount, milkType, reason) => 
      `Amata ${amount}L (${milkType}) ntiyemewe. Impamvu: ${reason}. Murakoze.`,
  };

  static formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If number starts with '0', remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // If number doesn't start with '250', add it
    if (!cleaned.startsWith('250')) {
      cleaned = `250${cleaned}`;
    }

    // Validate the final number format (should be 12 digits starting with 250)
    const finalNumber = cleaned;
    if (!/^250[7][2-9]\d{7}$/.test(finalNumber)) {
      throw new Error("Invalid phone number format. Must be a valid Rwanda phone number");
    }

    return finalNumber;
  }

  static async getAuthToken() {
    try {
      console.log('\nGetting Auth Token:');
      console.log('Username:', process.env.FDI_SMS_USERNAME?.substring(0, 8) + '...');
      console.log('Password exists:', !!process.env.FDI_SMS_PASSWORD);

      if (
        this.tokenCache &&
        this.tokenCache.expiresAt > Date.now() + 60000
      ) {
        console.log('Using cached token (expires in', 
          Math.round((this.tokenCache.expiresAt - Date.now()) / 1000), 
          'seconds)');
        return this.tokenCache.token;
      }

      console.log('Requesting new token...');
      const response = await axios.post(this.AUTH_URL, {
        api_username: process.env.FDI_SMS_USERNAME,
        api_password: process.env.FDI_SMS_PASSWORD
      });

      if (response.data?.access_token) {
        this.tokenCache = {
          token: response.data.access_token,
          expiresAt: new Date(response.data.expires_at).getTime()
        };
        console.log('New token received and cached');
        return response.data.access_token;
      }

      throw new Error('No access token in response');
    } catch (error) {
      console.error('\nAuth Error:', error instanceof axios.AxiosError ? {
        status: error.response?.status,
        data: error.response?.data
      } : error);
      throw new Error('Failed to authenticate with FDI SMS API');
    }
  }

  static async sendSms(phoneNumber, message) {
    try {
      const fullPhoneNumber = this.formatPhoneNumber(phoneNumber);
      console.log('\nSMS Sending Details:');
      console.log('Original Phone Number:', phoneNumber);
      console.log('Formatted Phone Number:', fullPhoneNumber);

      const token = await this.getAuthToken();
      console.log('Auth Token Received:', !!token);

      const msgRef = `MILK-${Date.now()}`;
      const payload = {
        msisdn: fullPhoneNumber,
        message: message,
        msgRef: msgRef,
        source_addr: process.env.FDI_SMS_SENDER_ID
      };
      console.log('\nSMS Payload:', payload);

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.log('\nRequest Headers:', {
        ...headers,
        'Authorization': 'Bearer [hidden]'
      });

      console.log('\nSending SMS to API...');
      const response = await axios.post(
        this.SMS_URL,
        payload,
        { headers, timeout: 10000 }
      );

      console.log('\nAPI Response:', response.data);
      console.log('SMS sent successfully to:', fullPhoneNumber);
      console.log('Message:', message);
      return response.data;
    } catch (error) {
      console.error('\nSMS Sending Error:');
      if (error instanceof axios.AxiosError) {
        console.error('API Error Response:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        console.error('Request Config:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        });
        throw new Error(
          `Failed to send SMS: ${error.response?.data?.message || error.message}`
        );
      }
      console.error('Unexpected Error:', error);
      throw error;
    }
  }

  static async notifySubmissionAccepted(phoneNumber, amount, milkType, pricePerLiter = 300) {
    const totalPrice = amount * pricePerLiter;
    const message = this.SMS_TEMPLATES.SUBMISSION_ACCEPTED(amount, milkType, totalPrice);
    return this.sendSms(phoneNumber, message);
  }

  static async notifySubmissionRejected(phoneNumber, amount, milkType, reason) {
    const message = this.SMS_TEMPLATES.SUBMISSION_REJECTED(amount, milkType, reason);
    return this.sendSms(phoneNumber, message);
  }
}

module.exports = MilkSubmissionSmsService;