import { Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterviewService } from './services/interview.service';
import { GetRoute, PostRoute } from 'libs/decorators/route.decorators';
import { SuccessDto } from 'libs/dtos';
import { Interview } from 'src/database/entities/interview.entity';

@Controller('api/interview')
@ApiTags('Interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @PostRoute('', {
    Ok: SuccessDto,
  })
  async store(): Promise<SuccessDto> {
    await this.interviewService.store();

    return new SuccessDto();
  }

  @GetRoute(':id')
  get(@Param('id') id: string): Promise<Interview> {
    return this.interviewService.get(id);
  }

  @GetRoute()
  getAll(): Promise<Interview[]> {
    return this.interviewService.getAll();
  }
}
