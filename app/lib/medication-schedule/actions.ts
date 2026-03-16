'use server';

import { z } from "zod/v4";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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

const MedicineRecordFormSchema = z.object({
  id: z.string(),
  patient_id: z.coerce.number(),
  medicine_id: z.coerce.number(),
  taken_date: z.string(),
});

const MedicineFormSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    doses: z.coerce.number()
});

const CreateMedicationSchedule = FormSchema.omit({ id: true });
const CreateMedicineRecords = MedicineRecordFormSchema.omit({ id: true, taken_date: true });
const CreateMedicine = MedicineFormSchema.omit({id: true});

export async function createMedicationSchedule(formData: FormData): Promise<void> {
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
  }

  revalidatePath('/mug-pee/medication-schedule');
  redirect('/mug-pee/medication-schedule');

}

export async function createMedicineRecords(formData: FormData) {
    const { patient_id, medicine_id } = CreateMedicineRecords.parse({
        patient_id: formData.get('patient_id'),
        medicine_id: formData.get('medicine_id'),
    });

    try {
        await sql `
            INSERT INTO medication_records (patient_id, medicine_id, taken_date)
            VALUES (${patient_id}, ${medicine_id}, NOW())
        `
    } catch (error) {
        console.log(error);
    }

    revalidatePath('/mug-pee/medication-schedule');
    redirect('/mug-pee/medication-schedule');
}

export async function createMedicine(formData: FormData) {
    const { name, description, doses } = CreateMedicine.parse({
        name: formData.get('name'),
        description: formData.get('description'),
        doses: formData.get('doses'),
    });
    
    try {
        await sql`
            INSERT INTO medicine (name, description, doses, created_at) VALUES (${name}, ${description}, ${doses}, NOW())
        `;
    } catch (error) {
        console.log(error);
    }

    revalidatePath('/mug-pee/medicines');
    redirect('/mug-pee/medicines');
}