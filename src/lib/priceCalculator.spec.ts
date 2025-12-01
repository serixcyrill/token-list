import test from 'ava';

import { PriceCalculator, priceCalculator } from './priceCalculator';
import { TokenInfo } from './tokenlist';

test('converts token amount with injected fetcher', async (t) => {
  const mockFetch: typeof fetch = async () =>
    (({
      ok: true,
      json: async () => ({
        bitcoin: {
          usd: 73000,
          last_updated_at: 1700000000,
        },
      }),
    } as unknown) as Response);

  const calculator = new PriceCalculator('https://mock.api', mockFetch);
  const token: TokenInfo = {
    chainId: 101,
    address: 'dummy',
    name: 'Bitcoin',
    decimals: 8,
    symbol: 'BTC',
    extensions: { coingeckoId: 'bitcoin' },
  };

  const quote = await calculator.convertTokenAmount({
    token,
    amount: 0.5,
    vsCurrency: 'usd',
  });

  t.is(quote.price, 73000);
  t.is(quote.value, 36500);
  t.is(quote.tokenSymbol, 'BTC');
  t.is(quote.vsCurrency, 'USD');
  t.is(quote.lastUpdated, '2023-11-14T22:13:20.000Z');
});

test('throws when token is missing a coingeckoId', async (t) => {
  const token: TokenInfo = {
    chainId: 101,
    address: 'dummy',
    name: 'Unknown',
    decimals: 8,
    symbol: 'UKN',
  };

  const error = await t.throwsAsync(
    priceCalculator.convertTokenAmount({
      token,
      amount: 1,
      vsCurrency: 'usd',
    })
  );

  t.truthy(error);
});
