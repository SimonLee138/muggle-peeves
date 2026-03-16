import Form from "@/app/ui/medicines/create-form";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";

export default function Page() {
    return (
        <main>
            <div>
                <Breadcrumbs aria-label="breadcrumb" className="mb-5">
                    <Link href="/mug-pee/medicines">
                        Medicines
                    </Link>
                    <Link href="/mug-pee/medicines/create">
                        Create Medicine
                    </Link>
                </Breadcrumbs>
            </div>
            <Form />
        </main>
    );
}