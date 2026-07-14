-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "movieid" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
