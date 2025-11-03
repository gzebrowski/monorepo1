import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technologia' },
    update: {},
    create: {
      name: 'Technologia',
      slug: 'technologia',
      description: 'Artykuły o najnowszych technologiach',
      color: '#3b82f6',
    },
  });

  const lifestyleCategory = await prisma.category.upsert({
    where: { slug: 'styl-zycia' },
    update: {},
    create: {
      name: 'Styl życia',
      slug: 'styl-zycia',
      description: 'Artykuły o stylu życia i rozwoju osobistym',
      color: '#10b981',
    },
  });

  const travelCategory = await prisma.category.upsert({
    where: { slug: 'podroze' },
    update: {},
    create: {
      name: 'Podróże',
      slug: 'podroze',
      description: 'Relacje z podróży i przewodniki',
      color: '#f59e0b',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@simpleblog.com' },
    update: {},
    create: {
      email: 'admin@simpleblog.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
  });

  // Create sample posts
  await prisma.post.upsert({
    where: { slug: 'wprowadzenie-do-nestjs' },
    update: {},
    create: {
      title: 'Wprowadzenie do NestJS',
      slug: 'wprowadzenie-do-nestjs',
      excerpt: 'Poznaj podstawy frameworka NestJS do budowy skalowalnych aplikacji Node.js',
      content: `# Wprowadzenie do NestJS

NestJS to progresywny framework Node.js do budowy wydajnych i skalowalnych aplikacji serwerowych. 

## Kluczowe cechy:
- Architektura modularna
- Dependency Injection
- Dekoratory TypeScript
- Wbudowana obsługa WebSockets, GraphQL, mikrousług

## Przykład kontrolera:

\`\`\`typescript
@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
\`\`\`

NestJS łączy najlepsze elementy z Angular i Express, oferując solidne fundamenty dla enterprise aplikacji.`,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: techCategory.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: 'produktywne-nawyki' },
    update: {},
    create: {
      title: '10 nawyków produktywnych programistów',
      slug: 'produktywne-nawyki',
      excerpt: 'Dowiedz się, jakie nawyki pomagają programistom być bardziej produktywnymi',
      content: `# 10 nawyków produktywnych programistów

Oto lista nawyków, które charakteryzują najlepszych programistów:

## 1. Regularne commitowanie kodu
Małe, częste commity są lepsze niż duże, rzadkie zmiany.

## 2. Pisanie testów
Testy to inwestycja w przyszłość projektu.

## 3. Continuous Learning
Branża IT wymaga ciągłego uczenia się nowych technologii.

## 4. Code Review
Przeglądanie kodu innych to najlepszy sposób na naukę.

## 5. Dokumentowanie
Dobra dokumentacja oszczędza czas całemu zespołowi.

Pozostałe nawyki obejmują regularne refactoring, używanie narzędzi automatyzacji, dbanie o work-life balance, networking w społeczności i systematyczne planowanie pracy.`,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: lifestyleCategory.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@simpleblog.com / admin123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });