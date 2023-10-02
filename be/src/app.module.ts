import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { InterviewModule } from './interview/interview.module';

@Module({
  imports: [DatabaseModule, InterviewModule],
})
export class AppModule {}
