-- DropForeignKey
ALTER TABLE "GameSession" DROP CONSTRAINT "GameSession_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_gameId_fkey";

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
