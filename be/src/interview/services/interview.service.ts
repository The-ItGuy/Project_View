import { Injectable } from '@nestjs/common';
import { InterviewRepository } from '../interview.repository';
import { Interview } from 'src/database/entities/interview.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class InterviewService {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  async store() {
    const filePath = 'src/interview/services/interviews.xlsx';

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      const interview = new Interview();

      interview.title = row['Project.Title'];
      interview.tech = row['Project.Technologies'];
      interview.skill_fe = row['Technical_Skillset.Frontend'];
      interview.skill_be = row['Technical_Skillset.Backend'];
      interview.skill_db = row['Technical_Skillset.Databases'];
      interview.skill_infra = row['Technical_Skillset.Infrastructre'];
      interview.availability = row['Other_Information.Availability'];

      await this.interviewRepository.save(interview);
    }
  }

  get(id: string): Promise<Interview> {
    return this.interviewRepository.findOneBy({ id });
  }

  getAll(): Promise<Interview[]> {
    return this.interviewRepository.find();
  }
}
