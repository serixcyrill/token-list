import { fetch } from 'cross-fetch';

import { TokenInfo } from './tokenlist';

type SimplePriceResponse = {
  [id: string]: {
    [currency: string]: number | undefined;
    last_updated_at?: number;
  };
};

export interface ConversionQuote {
  readonly amount: number;
  readonly price: number;
  readonly tokenSymbol: string;
  readonly vsCurrency: string;
  readonly value: number;
  readonly lastUpdated: string;
}

export interface ConversionRequest {
  readonly token: TokenInfo;
  readonly amount: number;
  readonly vsCurrency: string;
}

const DEFAULT_API_BASE = 'https://api.coingecko.com/api/v3';

export class PriceCalculator {
  constructor(
    private readonly apiBaseUrl: string = DEFAULT_API_BASE,
    private readonly fetcher: typeof fetch = fetch
  ) {}

  async fetchSpotPrice(
    coingeckoId: string,
    vsCurrency: string
  ): Promise<{ price: number; timestamp: string }> {
    const currency = vsCurrency.toLowerCase();
    const url = `${this.apiBaseUrl}/simple/price?ids=${encodeURIComponent(
      coingeckoId
    )}&vs_currencies=${encodeURIComponent(
      currency
    )}&include_last_updated_at=true`;

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${coingeckoId}`);
    }

    const body = (await response.json()) as SimplePriceResponse;
    const tokenPricing = body[coingeckoId];

    if (!tokenPricing || tokenPricing[currency] === undefined) {
      throw new Error(
        `Price for ${coingeckoId} in ${vsCurrency.toUpperCase()} is unavailable`
      );
    }

    const price = Number(tokenPricing[currency]);
    const timestamp = tokenPricing.last_updated_at
      ? new Date(tokenPricing.last_updated_at * 1000).toISOString()
      : new Date().toISOString();

    return { price, timestamp };
  }

  async convertTokenAmount({
    token,
    amount,
    vsCurrency,
  }: ConversionRequest): Promise<ConversionQuote> {
    if (amount < 0) {
      throw new Error('Amount must be zero or greater');
    }

    const coingeckoId = token.extensions?.coingeckoId;
    if (!coingeckoId) {
      throw new Error(
        `Token ${token.symbol} is missing a coingeckoId extension needed for pricing`
      );
    }

    const { price, timestamp } = await this.fetchSpotPrice(
      coingeckoId,
      vsCurrency
    );

    const value = price * amount;

    return {
      amount,
      price,
      tokenSymbol: token.symbol,
      vsCurrency: vsCurrency.toUpperCase(),
      value,
      lastUpdated: timestamp,
    };
  }
}

export const priceCalculator = new PriceCalculator();
