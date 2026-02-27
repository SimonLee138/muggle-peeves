'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import {
  MedicationScheduleEntry,
  DailyMedicationSchedule,
} from '@/app/lib/definitions';
import Stack from '@mui/material/Stack';
import { CheckIcon } from '@heroicons/react/24/outline';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
  width: '100%',
}));

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);
interface ScheduleClientProps {
  initialData: Awaited<MedicationScheduleEntry[]>;
}

const handleClick = () => {
  console.info('You clicked the Chip.');
};

const handleDelete = () => {
  console.info('You clicked the delete icon.');
};

export default function ScheduleForm({ initialData }: ScheduleClientProps) {
  const scheduleData = initialData;
  console.log(scheduleData);
  const dailyMedication: DailyMedicationSchedule[] = Object.values(
    scheduleData.reduce(
      (acc: Record<string, DailyMedicationSchedule>, item) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const dateKey = `${pad(item.start_date.getUTCDate())}/${pad(item.start_date.getUTCMonth() + 1)}`;

        if (!acc[dateKey]) {
          acc[dateKey] = {
            start_date_string: dateKey,
            pets: [],
          };
        }

        let petEntry = acc[dateKey].pets.find(
          (p) => p.patient_name === item.patient_name
        );

        if (!petEntry) {
          petEntry = {
            patient_name: item.patient_name,
            img_src: item.img_src,
            medicines: [],
          };
          acc[dateKey].pets.push(petEntry);
        }

        petEntry.medicines.push({
          medicine_name: item.medicine_name,
          taken: item.taken_count,
        });

        return acc;
      },
      {} as Record<string, DailyMedicationSchedule>
    )
  );
  console.log(dailyMedication);
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
      {' '}
      {/* responsive padding */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {dailyMedication.map((dayData, dayIndex) => (
          <Grid size={12} key={`${dayData.start_date_string}-${dayIndex}`}>
            <Item elevation={1} sx={{ p: { xs: 1.5, md: 2 } }}>
              <Grid container spacing={2} alignItems="stretch">
                {/* Date – full width on mobile, narrow on larger screens */}
                <Grid
                  size={{ xs: 12, sm: 2, md: 1.5, lg: 1 }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <Item
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {dayData.start_date_string}
                  </Item>
                </Grid>

                {/* Main content area */}
                <Grid size={{ xs: 12, sm: 10, md: 10.5, lg: 11 }}>
                  {dayData.pets.map((pet, petIndex) => (
                    <Item
                      key={`${pet.patient_name}-${petIndex}`}
                      sx={{
                        mb: { xs: 2, md: 2.5 },
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        {/* Pet chip – full width mobile, fixed narrow on desktop */}
                        <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
                          <Chip
                            avatar={
                              pet.img_src ? (
                                <Avatar
                                  alt={pet.patient_name}
                                  src={pet.img_src}
                                />
                              ) : undefined
                            }
                            label={pet.patient_name}
                            variant="outlined"
                            sx={{
                              flexGrow: 0,
                              width: 'auto',
                              height: 'auto',
                              justifyContent: 'flex-start',
                              '& .MuiChip-label': {
                                fontSize: { xs: '0.9rem', md: '1rem' },
                              },
                            }}
                          />
                        </Grid>

                        {/* Medicines – wrap on mobile, row on desktop */}
                        <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
                          <Stack
                            direction={{ xs: 'row', sm: 'row' }}
                            spacing={{ xs: 1, sm: 1.5 }}
                            useFlexGap
                            sx={{
                              flexWrap: 'wrap',
                            }}
                          >
                            {pet.medicines.map((medicine, medIndex) => (
                              <Chip
                                key={`${medicine.medicine_name}-${medIndex}`}
                                label={medicine.medicine_name}
                                onClick={handleClick}
                                onDelete={handleDelete}
                                deleteIcon={
                                  <CheckIcon
                                    style={{
                                      width: 18,
                                      height: 18,
                                      color: medicine.taken ? 'green' : 'gray', // optional: conditional color
                                    }}
                                  />
                                }
                                sx={{
                                  flexGrow: 0,
                                  flexShrink: 1,
                                  minWidth: 'auto',
                                  justifyContent: 'space-between',
                                  '& .MuiChip-label': {
                                    whiteSpace: 'nowrap',
                                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Item>
                  ))}
                </Grid>
              </Grid>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
