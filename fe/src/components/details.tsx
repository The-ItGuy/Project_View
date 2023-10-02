import { FC, useEffect, useState } from "react";
import { IInterview } from "./data-card";

interface DetailProps {
  data: IInterview;
  onClose: () => void;
}

const Detail: FC<DetailProps> = ({ data, onClose }) => {
  return (
    <div className="p-7">
      <div className="flex justify-between items-center border-b pb-4">
        <p className="text-xl">{data.title}</p>

        <button
          onClick={onClose}
          className="text-black px-2 border border-black rounded-md float-right"
        >
          x
        </button>
      </div>

      <div className="my-9">
        <p className="text-sm mb-2">Title</p>
        <p className="text-md">{data.title}</p>
      </div>
      <div className="my-9">
        <p className="text-sm mb-2">Technologies</p>
        <p className="text-md">{data.tech ?? "Not Specified"}</p>
      </div>
      <div className="my-9">
        <p className="text-sm mb-2">Frontend</p>
        <p className="text-md">{data.skill_fe ?? "Not Specified"}</p>
      </div>
      <div className="my-9">
        <p className="text-sm mb-2">Backend</p>
        <p className="text-md">{data.skill_be ?? "Not Specified"}</p>
      </div>
      <div className="my-9">
        <p className="text-sm mb-2">Databases</p>
        <p className="text-md">{data.skill_db ?? "Not Specified"}</p>
      </div>
      <div className="my-9">
        <p className="text-sm mb-2">Infrastructre</p>
        <p className="text-md">{data.skill_infra ?? "Not Specified"}</p>
      </div>
      <div className="mt-9">
        <p className="text-sm mb-2">Availability</p>
        <p className="text-md">{data.availability ?? "Not Specified"}</p>
      </div>
    </div>
  );
};

export default Detail;
