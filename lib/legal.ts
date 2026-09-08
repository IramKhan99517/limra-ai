/* LIMRA AI — domain price comparison for the Saudi market.
 *
 * Indicative retail prices (USD) reflecting typical registrar list pricing
 * including common first-term promotions. Renewal = standard annual renewal
 * at the cheapest registrar. .sa / .com.sa are sold through SaudiNIC-
 * accredited registrars; prices there are indicative and can vary by
 * registrar and Saudization of the registrant.
 */

export type Registrar = {
  name: string;
  url: (domain: string) => string;
};

const registrarUrl = (base: string) => (domain: string) =>
  `${base}${encodeURIComponent(domain)}`;

export const registrars: Registrar[] = [
  { name: "Namecheap", url: registrarUrl("https://www.namecheap.com/domains/registration/results/?domain=") },
  { name: "GoDaddy", url: registrarUrl("https://www.godaddy.com/domainsearch/find?domainToCheck=") },
  { name: "Porkbun", url: registrarUrl("https://porkbun.com/checkout/search?q=") },
  { name: "Cloudflare", url: registrarUrl("https://dash.cloudflare.com/?to=/:account/domains/register/") },
];

export type ExtensionPrices = {
  ext: string;
  /** registrar -> indicative first-year retail USD price */
  prices: Record<string, number>;
  renewal: number;
  note?: string;
};

export const extensionPrices: ExtensionPrices[] = [
  { ext: ".sa",     prices: { Porkbun: 55, Namecheap: 58, GoDaddy: 62 }, renewal: 60, note: "SaudiNIC-accredited" },
  { ext: ".com.sa", prices: { Porkbun: 50, Namecheap: 54, GoDaddy: 58 }, renewal: 56, note: "SaudiNIC-accredited" },
  { ext: ".com",    prices: { Namecheap: 5.98, Cloudflare: 9.77, Porkbun: 10.37 }, renewal: 10.44 },
  { ext: ".net",    prices: { Namecheap: 6.98, Cloudflare: 10.92, Porkbun: 11.06 }, renewal: 12.98 },
  { ext: ".org",    prices: { Namecheap: 5.98, Porkbun: 9.7, Cloudflare: 11.12 }, renewal: 12.98 },
  { ext: ".io",     prices: { Porkbun: 32.5, Namecheap: 34.98, Cloudflare: 37.02 }, renewal: 38 },
  { ext: ".ai",     prices: { Porkbun: 68.88, Namecheap: 72.98, GoDaddy: 79.99 }, renewal: 79.99 },
  { ext: ".co",     prices: { Namecheap: 6.98, Porkbun: 8.5, GoDaddy: 12.99 }, renewal: 27.98 },
  { ext: ".biz",    prices: { Namecheap: 5.98, Porkbun: 7.5 }, renewal: 14.98 },
  { ext: ".app",    prices: { Porkbun: 13.5, Namecheap: 15.98, Cloudflare: 17.02 }, renewal: 17.98 },
  { ext: ".dev",    prices: { Porkbun: 13.5, Namecheap: 15.98, Cloudflare: 17.02 }, renewal: 17.98 },
  { ext: ".me",     prices: { Namecheap: 4.98, Porkbun: 6.5 }, renewal: 19.98 },
  { ext: ".shop",   prices: { Namecheap: 1.98, Porkbun: 3.16 }, renewal: 29.98 },
  { ext: ".online", prices: { Namecheap: 1.98, Porkbun: 2.48 }, renewal: 32.98 },
  { ext: ".site",   prices: { Namecheap: 1.98, Porkbun: 2.48 }, renewal: 29.98 },
  { ext: ".cloud",  prices: { Namecheap: 1.98, Porkbun: 2.98 }, renewal: 21.98 },
  { ext: ".tech",   prices: { Namecheap: 4.98, Porkbun: 6.88 }, renewal: 49.98 },
  { ext: ".xyz",    prices: { Namecheap: 1.98, Porkbun: 2.98 }, renewal: 13.98 },
  { ext: ".store",  prices: { Namecheap: 1.98, Porkbun: 2.66 }, renewal: 49.98 },
  { ext: ".global", prices: { Porkbun: 29.5, Namecheap: 32.98 }, renewal: 44.98 },
  { ext: ".law",    prices: { Namecheap: 34.98, GoDaddy: 39.99 }, renewal: 69.98 },
  { ext: ".legal",  prices: { Namecheap: 34.98, GoDaddy: 44.99 }, renewal: 64.98 },
];

export type DomainRow = {
  ext: string;
  bestRegistrar: string;
  bestPrice: number;
  renewal: number;
  note?: string;
  buyUrl: string;
};

export function compareDomains(root: string): DomainRow[] {
  const clean = root.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return extensionPrices.map((x) => {
    const entries = Object.entries(x.prices);
    const [bestRegistrar, bestPrice] = entries.reduce((a, b) =>
      b[1] < a[1] ? b : a,
    );
    const domain = `${clean}${x.ext}`;
    const r = registrars.find((rg) => rg.name === bestRegistrar);
    return {
      ext: x.ext,
      bestRegistrar,
      bestPrice,
      renewal: x.renewal,
      note: x.note,
      buyUrl: r ? r.url(domain) : "#",
    };
  });
}