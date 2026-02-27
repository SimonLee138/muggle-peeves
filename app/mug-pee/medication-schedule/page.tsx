import { lusitana } from '@/app/ui/fonts';
import ScheduleForm from '@/app/ui/mediacation-schedule/table';
import { fetchMedicationSchedule } from '@/app/lib/data';
import { CreateSchedule } from '@/app/ui/mediacation-schedule/buttons';

export default async function Page() {
  const scheduleData = await fetchMedicationSchedule();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Medication Schedule
        </h1>
        <CreateSchedule />
      </div>
      <ScheduleForm initialData={scheduleData}></ScheduleForm>
    </div>
  );
}
