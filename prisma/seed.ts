import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const passwordRyaba = await bcrypt.hash('lolkek', roundsOfHashing);

  const user = await prisma.user.upsert({
    where: { email: 'ryaba@gmail.com' },
    update: {
      password: passwordRyaba,
    },
    create: {
      email: 'ryaba@gmail.com',
      password: passwordRyaba,
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
