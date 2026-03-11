import { lusitana } from '@/app/ui/fonts';
import ScheduleForm from '@/app/ui/medication-schedule/table';
import { fetchMedicationRecords, fetchMedicationSchedule } from '@/app/lib/data';
import { CreateSchedule } from '@/app/ui/medication-schedule/buttons';
import { Suspense } from 'react';
import { MedicationScheduleSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  const scheduleData = fetchMedicationSchedule();
  const medsTakenData = fetchMedicationRecords();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Medication Schedule
        </h1>
        <CreateSchedule />
      </div>
      <Suspense fallback={<MedicationScheduleSkeleton/>}>
        <ScheduleForm initialData={scheduleData} medsTakenData={medsTakenData}></ScheduleForm>
      </Suspense>
    </div>
  );
}
