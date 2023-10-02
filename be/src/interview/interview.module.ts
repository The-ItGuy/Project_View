import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { InterviewRepository } from './interview.repository';
import { InterviewService } from './services/interview.service';
import { InterviewController } from './interview.controller';

@Module({
  imports: [DatabaseModule.forRepository([InterviewRepository])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
