import { AbstractRepository } from 'src/database/repositories/abstract.repository';
import { DatabaseRepository } from 'src/database/decorators/repository.decorator';
import { Interview } from 'src/database/entities/interview.entity';

@DatabaseRepository(Interview)
export class InterviewRepository extends AbstractRepository<Interview> {}
