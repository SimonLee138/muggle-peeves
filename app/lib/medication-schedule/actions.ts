'use server';

import { z } from "zod/v4";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
 
const sql = postgres(process.env.mug_pee_POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  patient_id: z.coerce.number(),
  medicine_id: z.coerce.number(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  times_daily: z.coerce.number(),
});

const CreateMedicationSchedule = FormSchema.omit({ id: true });

export async function createMedicationSchedule(formData: FormData) {
  const { patient_id, medicine_id, start_date, end_date, start_time, end_time, times_daily } = CreateMedicationSchedule.parse({
    patient_id: formData.get('patient'),
    medicine_id: formData.get('medicine'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    start_time: formData.get('start_time'),
    end_time: formData.get('end_time'),
    times_daily: formData.get('times_daily'),
  });

  try {
    await sql`
        INSERT INTO medication_schedule (created_at, patient_id, medicine_id, times_daily, start_time, end_time, start_date, end_date) 
        VALUES (NOW(), ${patient_id}, ${medicine_id}, ${times_daily}, ${start_time}, ${end_time}, ${start_date}, ${end_date})
    `;
  } catch (error) {
    console.log(error);
    return {
        message: 'Database Error: Failed to Create Medication Schedule.',
    };
  }

  revalidatePath('/dashboard/medication-schedule');
  redirect('/dashboard/medication-schedule');

}