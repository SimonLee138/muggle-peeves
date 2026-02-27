import Link from "next/link";
import Button from "@mui/material/Button";

export function CreateSchedule() {
    return (
        <Link href="/dashboard/medication-schedule/create">
            <Button variant="outlined">Create</Button>
        </Link>
    );
}