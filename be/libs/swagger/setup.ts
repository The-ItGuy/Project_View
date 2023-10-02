import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { trimEnd } from 'lodash';

export async function setupSwagger(
  app: INestApplication,
  apiUrl = '/',
): Promise<void> {
  const documentBuilder = new DocumentBuilder().addBearerAuth();

  //   documentBuilder.addServer('https://api.youtube-companion.com', 'Production');

  if (process.env.NODE_ENV === 'development') {
    documentBuilder.addServer('http://localhost:3001', 'Localhost');
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup('/api/doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API documentation',
  });

  Logger.log(`Documentation: ${trimEnd(apiUrl, '/')}/api/doc`);
}
