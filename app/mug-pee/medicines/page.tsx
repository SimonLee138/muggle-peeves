import { fetchMedicine } from "@/app/lib/data";
import { Medicine } from "@/app/lib/definitions";
import { lusitana } from "@/app/ui/fonts";
import MedicineTable from "@/app/ui/medicines/table";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Page() {
    const medicineData = fetchMedicine();
    
    return (
        <div className="w-full h-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>
                    Medicines
                </h1>
                <Link href="/mug-pee/medicines/create">
                    <Button variant="outlined">Create</Button>
                </Link>
            </div>
            <div className="h-full">
                <MedicineTable medicineData={medicineData} />
            </div>
        </div>
    );
}