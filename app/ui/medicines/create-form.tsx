'use client';

import { createMedicine } from "@/app/lib/medication-schedule/actions";
import { Button, FormControl, FormLabel, Grid, styled, TextField } from "@mui/material";

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function Form() {
    return (
        <form action={createMedicine}>
            <Grid container spacing={2}>
                <FormGrid size={{ md: 6, xs: 12 }}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <TextField id="name" name="name" type="text" />
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ md: 6, xs: 12 }}>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <TextField id="description" name="description" type="text" />
                    </FormControl>
                </FormGrid>
                <FormGrid size={{ md: 6, xs: 12 }}>
                    <FormControl>
                        <FormLabel>Doses</FormLabel>
                        <TextField id="doses" name="doses" type="number" />
                    </FormControl>
                </FormGrid>
                
            </Grid>
            <Grid container>
                <FormGrid size={{ xs: 12, md: 1}}>
                    <FormControl size="small" fullWidth required>
                        <Button variant="outlined" type="submit">Submit</Button>
                    </FormControl>
                </FormGrid>
            </Grid>
        </form>
    );
}