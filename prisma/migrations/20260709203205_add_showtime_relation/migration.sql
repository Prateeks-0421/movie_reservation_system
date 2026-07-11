-- CreateTable
CREATE TABLE "ShowTime" (
    "id" SERIAL NOT NULL,
    "movieid" INTEGER NOT NULL,
    "showdate" TIMESTAMP(3) NOT NULL,
    "showtime" TIMESTAMP(3) NOT NULL,
    "screen" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShowTime" ADD CONSTRAINT "ShowTime_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
