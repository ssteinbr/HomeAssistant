const fetch = require('node-fetch');

class HomeAssistantClient {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
  }

  async request(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Home Assistant API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getStates() {
    return this.request('/states');
  }

  async getState(entityId) {
    return this.request(`/states/${entityId}`);
  }

  async callService(domain, service, data = {}) {
    return this.request(`/services/${domain}/${service}`, 'POST', data);
  }

  async turnOn(entityId) {
    const domain = entityId.split('.')[0];
    return this.callService(domain, 'turn_on', { entity_id: entityId });
  }

  async turnOff(entityId) {
    const domain = entityId.split('.')[0];
    return this.callService(domain, 'turn_off', { entity_id: entityId });
  }

  async toggle(entityId) {
    const domain = entityId.split('.')[0];
    return this.callService(domain, 'toggle', { entity_id: entityId });
  }

  async getLights() {
    const states = await this.getStates();
    return states.filter(entity => entity.entity_id.startsWith('light.'));
  }

  async getSwitches() {
    const states = await this.getStates();
    return states.filter(entity => entity.entity_id.startsWith('switch.'));
  }

  async getLightsAndSwitches() {
    const states = await this.getStates();
    return states.filter(entity =>
      entity.entity_id.startsWith('light.') ||
      entity.entity_id.startsWith('switch.')
    );
  }

  async checkConnection() {
    try {
      await this.request('/');
      return { connected: true };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = HomeAssistantClient;
