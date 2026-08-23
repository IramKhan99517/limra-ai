import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL ?? "", {
  ssl: "require",
  prepare: false,
});

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  console.log("Seeding LIMRA AI database...");

  await sql`delete from compliance_activity`;
  await sql`delete from filings`;
  await sql`delete from licenses`;
  await sql`delete from entities`;

  const entities = await sql`
    insert into entities (name, owner, status, saudization_score) values
      ('Najd Tech Solutions LLC', 'Layla Al-Otaibi', 'active', 71),
      ('Falak Logistics', 'Omar Al-Harbi', 'active', 64),
      ('Dammam Steel Works', 'Sara Al-Qahtani', 'active', 58),
      ('Riyadh Cloud Systems', 'Yousef Al-Dossari', 'pending', 45),
      ('Jeddah Retail Group', 'Nora Al-Zahrani', 'active', 76),
      ('NEOM Advisory Partners', 'Khalid Al-Ghamdi', 'active', 69),
      ('Tabuk Agri Innovations', 'Huda Al-Shehri', 'pending', 38),
      ('Eastern Petrochem Services', 'Faisal Al-Mutairi', 'active', 61),
      ('Makkah Hospitality Co.', 'Amal Al-Amri', 'suspended', 29),
      ('Vision Data Labs', 'Bandar Al-Rashid', 'active', 82),
      ('Qassim Manufacturing', 'Reem Al-Subaie', 'active', 55),
      ('Riyadh Regional HQ Trading', 'Mishal Al-Anazi', 'active', 88)
    returning id
  `;

  const licenseRows = [
    ["MISA Foreign Investment License", "approved"],
    ["Commercial Registration", "approved"],
    ["ZATCA Tax Registration", "approved"],
    ["GOSI Registration", "approved"],
    ["Municipal License", "in_review"],
    ["SAGIA Industrial License", "approved"],
    ["Import/Export License", "expiring"],
    ["SEZ Operating Permit", "approved"],
    ["Civil Defense Permit", "in_review"],
    ["Environmental Compliance Certificate", "approved"],
    ["Saudization (Nitaqat) Certificate", "approved"],
    ["Trademark Registration", "expired"],
  ] as const;

  for (const entity of entities) {
    // 3–4 licenses per entity, cycling through the pool
    for (let i = 0; i < 3; i++) {
      const [type, status] = licenseRows[(entity.id + i) % licenseRows.length];
      await sql`
        insert into licenses (entity_id, type, status, issue_date, expiry_date)
        values (
          ${entity.id}, ${type}, ${status},
          now() - (interval '1 day' * (30 + entity.id * 5)),
          now() + (interval '1 day' * (180 - entity.id * 3))
        )
      `;
    }
  }

  const filingTitles = [
    "Quarterly ZATCA VAT Return",
    "GOSI Monthly Contribution",
    "Nitaqat Saudization Report",
    "Annual MISA License Renewal",
    "Municipal License Renewal",
    "Environmental Compliance Audit",
  ];

  for (const entity of entities) {
    const count = (entity.id % 3) + 1;
    for (let i = 0; i < count; i++) {
      const title = filingTitles[(entity.id + i) % filingTitles.length];
      const status = i === 0 ? "pending" : entity.id % 4 === 0 ? "overdue" : "submitted";
      await sql`
        insert into filings (entity_id, title, due_date, status)
        values (
          ${entity.id}, ${title},
          now() + (interval '1 day' * (5 + i * 9 - (entity.id % 5))),
          ${status}
        )
      `;
    }
  }

  // 8 weeks of aggregate compliance activity for the dashboard chart
  for (const entity of entities) {
    for (let w = 0; w < 8; w++) {
      const base = 55 + (entity.id % 5) * 6;
      const score = Math.min(99, base + w * 2 + (entity.id % 3));
      await sql`
        insert into compliance_activity (entity_id, week_start, score)
        values (${entity.id}, now() - (interval '1 week' * (7 - w)), ${score})
      `;
    }
  }

  console.log(`Seeded ${entities.length} entities with licenses, filings, and activity.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
