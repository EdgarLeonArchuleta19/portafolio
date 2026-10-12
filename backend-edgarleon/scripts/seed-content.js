const { compileStrapi, createStrapi } = require('@strapi/strapi');

const port = process.env.PORT || 1337;

async function isStrapiRunning() {
  try {
    await fetch(`http://localhost:${port}/_health`, { signal: AbortSignal.timeout(1000) });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (await isStrapiRunning()) {
    console.error(`Strapi está corriendo en el puerto ${port}. Detén "npm run develop" y vuelve a intentar.`);
    process.exit(1);
  }

  process.env.FORCE_SEED = 'true';

  const app = await createStrapi(await compileStrapi()).load();
  await app.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
