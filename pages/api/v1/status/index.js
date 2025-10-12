import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = dbVersionResult.rows?.[0]?.server_version;

  const dbMaxConnResult = await database.query("SHOW max_connections;");
  const databaseMaxConnections = parseInt(
    dbMaxConnResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const dbUsedConnResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnections = dbUsedConnResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database_version: databaseVersion,
      database_max_connections: databaseMaxConnections,
      database_opened_connections: databaseOpenedConnections,
    },
  });
}
export default status;
