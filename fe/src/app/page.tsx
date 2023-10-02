"use client";

import { useEffect, useState } from "react";
import { interviewApi } from "./api";
import DataCard, { IInterview } from "@src/components/data-card";
import Detail from "@src/components/details";

export default function Home() {
  const [interviewData, setInterviewData] = useState<IInterview[]>();
  const [detail, setDetail] = useState<IInterview>();

  const fetchData = async () => {
    const response = await interviewApi.interviewControllerGetAll();

    setInterviewData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showDetails = (index: number) => {
    setDetail(interviewData?.[index]);
  };

  if (!interviewData) {
    return;
  }

  return (
    <main className="grid auto-cols-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-auto p-5 gap-x-3 gap-y-4 relative">
      {interviewData.map((data, index) => (
        <div
          className="border rounded-md shadow-md p-3 cursor-pointer hover:scale-105 transition duration-300"
          key={data.id}
          onClick={() => showDetails(index)}
        >
          <DataCard data={data} />
        </div>
      ))}

      {detail && (
        <div className="h-[100vh] w-2/5 shadow-2xl drop-shadow-2xl bg-white fixed right-0 top-0 transition-width duration-700">
          <Detail data={detail} onClose={() => setDetail(undefined)} />
        </div>
      )}
    </main>
  );
}
