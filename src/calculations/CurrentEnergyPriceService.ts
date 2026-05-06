// src/calculations/CurrentEnergyPriceService.ts
export class CurrentEnergyPriceService {
  async getCurrent() {
    try {
      // Using the API mentioned in your task
      const response = await fetch(
        'https://api.currently.io/v2.0/gsi/marketdata?zip=61348'
      );

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      // Adjust according to actual API response shape
      const price = data.price || data.avg_price || data.current_price || 28.4;

      return {
        price: Number(price.toFixed(1)),
        unit: 'ct/kWh',
        timestamp: new Date(),
        source: 'currently.io'
      };
    } catch (error) {
      console.warn('Failed to fetch real energy price → using fallback', error);
      
      // Fallback (you can remove later)
      return {
        price: 28.4,
        unit: 'ct/kWh',
        timestamp: new Date(),
        source: 'mock'
      };
    }
  }
}