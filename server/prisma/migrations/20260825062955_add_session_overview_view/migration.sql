CREATE VIEW "SessionOverview" AS
SELECT
  gs.id,
  g.title AS "gameTitle",
  g."gameType",
  gs."playedAt",
  gs.outcome,
  (
    SELECT string_agg(p.username, ', ' ORDER BY p.username)
    FROM "GamePlayer" gp
    JOIN "Player" p ON p.id = gp."playerId"
    WHERE gp."sessionId" = gs.id AND gp.winner = true
  ) AS winners,
  gs.notes
FROM "GameSession" gs
JOIN "Game" g ON g.id = gs."gameId"
ORDER BY gs."playedAt" DESC;
