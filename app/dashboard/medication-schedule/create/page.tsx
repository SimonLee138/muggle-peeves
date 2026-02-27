import { fetchMedicine, fetchPatient } from "@/app/lib/data";
import Form from "@/app/ui/mediacation-schedule/create-form";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

export default async function Page() {
    const patients = await fetchPatient();
    const medicines = await fetchMedicine();

    return (
        <main>
            <div>
                <Breadcrumbs aria-label="breadcrumb" className="mb-5">
                    <Link href="/dashboard/medication-schedule">
                        Medication Schedule
                    </Link>
                    <Link href="/dashboard/medication-schedule/create">
                        Create Schedule
                    </Link>
                </Breadcrumbs>
            </div>
            
            <Form patients={patients} medicines={medicines}/>
        </main>
    );
}