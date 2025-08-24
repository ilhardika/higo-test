import { RecordItem } from "./types";

const SAMPLE = [
  {
    location: "The Rustic Tavern",
    date: "2023-12-07",
    loginHour: "16:07:00",
    name: "Francesca Spendlove",
    birthYear: 1978,
    gender: "Female",
    email: "fspendlove0@eventbrite.com",
    phone: "829-817-4593",
    device: "Samsung",
    interest: "Social Media",
    locationType: "urban",
  },
  {
    location: "Barrel & Brew",
    date: "2023-12-07",
    loginHour: "16:25:00",
    name: "Maximilian Benezeit",
    birthYear: 1970,
    gender: "Male",
    email: "mbenezeit1@nymag.com",
    phone: "132-881-9144",
    device: "Samsung",
    interest: "Social Media",
    locationType: "sub urban",
  },
  {
    location: "Java Junction",
    date: "2023-12-11",
    loginHour: "20:07:00",
    name: "Chalmers Boxer",
    birthYear: 1961,
    gender: "Male",
    email: "cboxer2@dagondesign.com",
    phone: "129-790-8261",
    device: "Samsung",
    interest: "Social Media",
    locationType: "coastal",
  },
  {
    location: "The Urban Cafe",
    date: "2023-12-07",
    loginHour: "08:53:00",
    name: "Cori Binton",
    birthYear: 2001,
    gender: "Male",
    email: "cbinton3@amazon.com",
    phone: "543-857-9603",
    device: "Samsung",
    interest: "Social Media",
    locationType: "Suburban Fringe",
  },
  {
    location: "Java Junction",
    date: "2023-12-26",
    loginHour: "17:02:00",
    name: "Ermanno Deveril",
    birthYear: 1972,
    gender: "Male",
    email: "edeveril4@booking.com",
    phone: "701-808-5030",
    device: "Samsung",
    interest: "Social Media",
    locationType: "metropolitan",
  },
];

function uid(n = 6) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + n);
}

// Build a larger mock dataset by repeating SAMPLE with small variants
const MOCK: RecordItem[] = Array.from({ length: 125 }).flatMap((_, i) => {
  const s = SAMPLE[i % SAMPLE.length];
  return {
    id: `${i + 1}`,
    location: s.location,
    date: new Date(
      new Date(s.date).getTime() + (i % 10) * 86400000
    ).toISOString(),
    loginHour: s.loginHour,
    name: `${s.name} ${uid(2)}`,
    birthYear: s.birthYear,
    gender: i % 3 === 0 ? "Female" : i % 3 === 1 ? "Male" : "Other",
    email: s.email.replace(/@(.*)$/, `+${i}@$1`),
    phone: s.phone,
    device: s.device,
    interest: s.interest,
    locationType: s.locationType,
  };
});

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchRecords({
  page = 1,
  limit = 25,
  gender,
  q,
}: {
  page?: number;
  limit?: number;
  gender?: string;
  q?: string;
}): Promise<Paginated<RecordItem>> {
  // simple filter
  let list = MOCK.slice();
  if (gender)
    list = list.filter(
      (r) => r.gender.toLowerCase() === String(gender).toLowerCase()
    );
  if (q) {
    const ql = q.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(ql) ||
        r.email.toLowerCase().includes(ql) ||
        r.location.toLowerCase().includes(ql)
    );
  }
  const total = list.length;
  const clampedLimit = Math.max(1, Math.min(100, limit));
  const totalPages = Math.max(1, Math.ceil(total / clampedLimit));
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * clampedLimit;
  const data = list.slice(start, start + clampedLimit);
  // simulate latency
  await new Promise((r) => setTimeout(r, 120));
  return { data, page: p, limit: clampedLimit, total, totalPages };
}

export async function fetchGenderStats() {
  const counts: Record<string, number> = {};
  for (const r of MOCK) counts[r.gender] = (counts[r.gender] || 0) + 1;
  const buckets = Object.keys(counts).map((g) => ({
    gender: g,
    count: counts[g],
  }));
  await new Promise((r) => setTimeout(r, 80));
  return { buckets };
}
