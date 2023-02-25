-- CreateTable
CREATE TABLE "Scancode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Scancode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scancode_code_key" ON "Scancode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Scancode_userId_key" ON "Scancode"("userId");

-- AddForeignKey
ALTER TABLE "Scancode" ADD CONSTRAINT "Scancode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
