import { FC } from "react";

export interface IInterview {
  id: string;
  createdAt: string;
  title: string;
  tech: string;
  skill_fe: string;
  skill_be: string;
  skill_db: string;
  skill_infra: string;
  availability: string;
}

interface InterviewProps {
  data: IInterview;
}

const DataCard: FC<InterviewProps> = ({ data }) => {
  return (
    <>
      <div className="mb-5">
        <p className="text-xs">Title</p>
        <p className="text-lg">{data.title}</p>
      </div>

      <div className="mb-5">
        <p className="text-xs">Technologies</p>
        <p className="text-base">{data.tech ?? "-"}</p>
      </div>

      <div className="mb-5">
        <p className="text-xs">Frontend</p>
        <p className="text-base">{data.skill_fe ?? "-"}</p>
      </div>

      <div className="mb-5">
        <p className="text-xs">Backend</p>
        <p className="text-base">{data.skill_be ?? "-"}</p>
      </div>

      <div className="mb-5">
        <p className="text-xs">Databases</p>
        <p className="text-base">{data.skill_db ?? "-"}</p>
      </div>

      <div className="mb-5">
        <p className="text-xs">Infrastructre</p>
        <p className="text-base">{data.skill_infra ?? "-"}</p>
      </div>

      <div className="">
        <p className="text-xs">Availability</p>
        <p className="text-base">{data.availability ?? "-"}</p>
      </div>
    </>
  );
};

export default DataCard;
