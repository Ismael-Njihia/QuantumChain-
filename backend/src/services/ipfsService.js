const { create } = require('ipfs-http-client');
const config = require('../config');

class IPFSService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    try {
      this.client = create({
        host: config.ipfs.host,
        port: config.ipfs.port,
        protocol: config.ipfs.protocol,
      });
      console.log('IPFS service initialized');
    } catch (error) {
      console.error('Error initializing IPFS service:', error);
    }
  }

  async uploadFile(fileBuffer, fileName) {
    try {
      const result = await this.client.add({
        path: fileName,
        content: fileBuffer,
      });

      return {
        hash: result.cid.toString(),
        path: result.path,
        size: result.size,
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  async getFile(hash) {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw error;
    }
  }

  async pinFile(hash) {
    try {
      await this.client.pin.add(hash);
      return { success: true, hash };
    } catch (error) {
      console.error('Error pinning file:', error);
      throw error;
    }
  }
}

module.exports = new IPFSService();
