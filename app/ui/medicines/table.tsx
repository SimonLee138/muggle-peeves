import { Medicine } from "@/app/lib/definitions";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { use } from "react";

interface MedicineProps {
    medicineData: Promise<Medicine[]>;
}

function formatDateTime(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');

  const yyyy = date.getFullYear();
  const mm   = pad(date.getMonth() + 1);    // months are 0-based
  const dd   = pad(date.getDate());

  const hh   = pad(date.getHours());
  const min  = pad(date.getMinutes());
  const ss   = pad(date.getSeconds());

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export default function MedicineTable({ medicineData }: MedicineProps) {
    const tableData = use(medicineData);
    return (
        <TableContainer component={Paper}>
            <Table key="medicine-table">
                <TableHead>
                    <TableRow key="medicine-table-header" sx={{background: "#e1faec"}}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Doses</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Create Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tableData.map((r) => (
                            <TableRow key={`medicine-table-${r.id}`}>
                                <TableCell component="th" scope="row">{r.name}</TableCell>
                                <TableCell align="right">{r.doses ?? '-'}</TableCell>
                                <TableCell align="right">{r.description ?? '-'}</TableCell>
                                <TableCell align="right">{formatDateTime(r.created_at)}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}