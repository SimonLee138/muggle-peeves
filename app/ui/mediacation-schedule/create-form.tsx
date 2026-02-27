'use client';

import { createMedicationSchedule } from "@/app/lib/medication-schedule/actions";
import { MedicationScheduleCreateForm, Medicine, Patient } from "@/app/lib/definitions";
import { Button, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import * as React from "react";
import NumberSpinner from "../components/NumberSpinner";

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function Form({ patients, medicines } : {patients: Patient[]; medicines: Medicine[]}) {
    /*const [name, setName] = React.useState('');
    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');
    const handleNameChange = (event: SelectChangeEvent) => {
        setName(event.target.value as string);
    };*/
    const [patient, setPatient] = React.useState<Number>(0);
    const [medicine, setMedicine] = React.useState<Number>(0);
    const [takenCount, setTakenCount] = React.useState<Number>(0);

    return (
        <form action={createMedicationSchedule}>
            <Grid container spacing={3}>
                {/*<FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl size="small" fullWidth required>
                        <FormLabel htmlFor="pet-name" required>Name</FormLabel>
                        <OutlinedInput 
                            id="pet-name"
                            name="pet-name"
                            type="name"
                            required
                            size="small"
                            label="Name"
                        />
                    </FormControl>
                </FormGrid>*/}
                
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl>
                        <FormLabel>Date from</FormLabel>
                        <TextField id="start_date" name="start_date" type="date"/>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl>
                        <FormLabel>Date to</FormLabel>
                        <TextField id="end_date" name="end_date" type="date"/>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl>
                        <FormLabel>Time from</FormLabel>
                        <TextField id="start_time" name="start_time" type="time" defaultValue={'00:00:00'}/>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl>
                        <FormLabel>Time to</FormLabel>
                        <TextField id="end_time" name="end_time" type="time" defaultValue={'00:00:00'}/>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl size="small" fullWidth required>
                        <FormLabel>Name</FormLabel>
                        <Select 
                            labelId="patient-select-label" id="patient-select" name="patient" label="Name" value={patient} onChange={(e) => setPatient(e.target.value as number)}
                        >
                            {
                                patients.map((patient) => (
                                    <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6}}>
                    <FormControl size="small" fullWidth required>
                        <FormLabel>Medicine</FormLabel>
                        <Select 
                            labelId="med-name-select-label" id="med-name-select" name="medicine" label="Medicine" value={medicine} onChange={(e) => setMedicine(e.target.value as number)}
                        >
                            {
                                medicines.map((medicine) => (
                                    <MenuItem key={medicine.id} value={medicine.id}>{medicine.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 12}}>
                    <FormControl size="small" fullWidth required>
                        <FormLabel>Taken Count</FormLabel>
                        <Select 
                            labelId="taken-count-select-label" id="taken-count-select" name="taken_count" label="Taken Count" value={takenCount} onChange={(e) => setTakenCount(e.target.value as number)}
                        >
                            {
                                Array.from({ length: 10 }, (_, index) => (
                                    <MenuItem value={index + 1}>{index + 1}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 1}}>
                    <FormControl size="small" fullWidth required>
                        <Button variant="outlined" type="submit">Submit</Button>
                    </FormControl>
                </FormGrid>
            </Grid>
        </form>
    );
}