const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const awsTextractService = require('./awsTextractService');

class AIExtractionService {
  async extractDocumentData(document, invoice) {
    try {
      document.extractionStatus = 'processing';
      await document.save();

      const extractedData = await awsTextractService.extractFields(document, invoice);

      document.extractedData = extractedData;
      document.extractionStatus = 'completed';
      await document.save();

      return document;
    } catch (error) {
      console.error(`AI Extraction Failed for doc ${document._id}:`, error.message);
      document.extractionStatus = 'failed';
      await document.save();
      throw new Error(`AI Extraction process failed: ${error.message}`);
    }
  }
}

module.exports = new AIExtractionService();
