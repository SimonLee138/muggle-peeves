import { lusitana } from '@/app/ui/fonts';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Medication Schedule</h1>
            </div>
        </div>
    );
}