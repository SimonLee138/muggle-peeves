'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import {
  MedicationScheduleEntry,
  DailyMedicationSchedule,
  MedicationRecordsEntry,
} from '@/app/lib/definitions';
import Stack from '@mui/material/Stack';
import { CheckIcon } from '@heroicons/react/24/outline';
import { use, useEffect, useRef, useTransition } from 'react';
import { createMedicineRecords } from '@/app/lib/medication-schedule/actions';
import { Backdrop, CircularProgress, Typography } from '@mui/material';


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

interface ScheduleClientProps {
  initialData: Promise<MedicationScheduleEntry[]>;
  medsTakenData: Promise<MedicationRecordsEntry[]>;
}

export default function ScheduleForm({ initialData, medsTakenData }: ScheduleClientProps) {
  const [isPending, startTransition] = useTransition();
  const gridRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scheduleData = use(initialData);
  const medsTaken = use(medsTakenData);
  const ScheduleTree: Record<string, Record<string, MedicationScheduleEntry[]>> = {};
  const medsTakenTree: Record<string, Record<string, Record<string, number>>> = {};

  const handleMedClick = async(medicine_id: number, patient_id: number) => {
    if (isPending) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('medicine_id', medicine_id.toString());
      formData.append('patient_id', patient_id.toString());

      try {
        await createMedicineRecords(formData);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  for (const row of medsTaken) {
    const takenDate = (new Date(row.taken_date)).toISOString().split('T')[0];

    if (!medsTakenTree[takenDate]) {
      medsTakenTree[takenDate] = {};
    }

    if (!medsTakenTree[takenDate][row.patient_name]) {
      medsTakenTree[takenDate][row.patient_name] = {};
    }

    if (!medsTakenTree[takenDate][row.patient_name][row.medicine_name]) {
      medsTakenTree[takenDate][row.patient_name][row.medicine_name] = 0;
    }
    medsTakenTree[takenDate][row.patient_name][row.medicine_name]++;
  }
  console.log(medsTakenTree);

  for (const row of scheduleData) {
    const start = new Date(row.start_date);
    const end = new Date(row.end_date);

    let current = new Date(start);

    while (current <= end) {
      const dayKey = current.toISOString().split('T')[0];

      if (!ScheduleTree[dayKey]) {
        ScheduleTree[dayKey] = {};
      }

      if (!ScheduleTree[dayKey][row.patient_name]) {
        ScheduleTree[dayKey][row.patient_name] = [];
      }

      const dayEntry = { ...row };
      if (medsTakenTree[dayKey] && medsTakenTree[dayKey][row.patient_name] && medsTakenTree[dayKey][row.patient_name][row.medicine_name]) {
        dayEntry.doses_taken = medsTakenTree[dayKey][row.patient_name][row.medicine_name] ?? 0;
      } else {
        dayEntry.doses_taken = 0;
      }
      ScheduleTree[dayKey][row.patient_name].push(dayEntry);
      
      current.setDate(current.getDate() + 1);
    }
  }
  console.log(ScheduleTree);
  const sortedSchedule = Object.keys(ScheduleTree).sort();

  const currentDate = new Date().toISOString().split('T')[0];
  useEffect(() => {
    const todayGrid = gridRefs.current.get(currentDate);

    if (todayGrid) {
      const timer = setTimeout(() => {
        todayGrid.focus();
        todayGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [!!sortedSchedule]);

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }}>
      {' '}
      <Backdrop
        open={isPending}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2, // above most things
          backgroundColor: 'rgba(0, 0, 0, 0.6)',       // semi-transparent dark
          // Optional: add blur for modern feel (Chrome/Edge/Safari)
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Recording dose...
          </Typography>
        </Box>
      </Backdrop>
      
      {/* responsive padding */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {sortedSchedule.map((dayData, dayIndex) => (
          <Grid size={12} key={`${dayData}`} ref={(el) => {
              if (el) {
                gridRefs.current.set(dayData, el);
              } else {
                gridRefs.current.delete(dayData);
              }
            }}
            tabIndex={-1}
            sx={{
              outline: 'none',
              '&:focus': {
                outline: '2px solid #1976d2',
                outlineOffset: '2px',
                borderRadius: '4px',
              },
            }}
          >
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
                    {dayData}
                  </Item>
                </Grid>

                {/* Main content area */}
                <Grid size={{ xs: 12, sm: 10, md: 10.5, lg: 11 }}>
                  {Object.entries(ScheduleTree[dayData]).map(([pet, meds], petIndex) => (
                    <Item
                      key={`${pet}`}
                      sx={{
                        mb: { xs: 2, md: 2.5 },
                        p: { xs: 1.5, md: 2 },
                        borderRadius: 2,
                      }}
                    >
                      <Grid container spacing={1} alignItems="center">
                        {/* Pet chip – full width mobile, fixed narrow on desktop */}
                        <Grid size={{ xs: 4, md: 3, lg: 2.5 }}>
                          <Chip
                            label={`${pet}`}
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
                        <Grid size={{ xs: 8, md: 9, lg: 9.5 }}>
                          <Stack
                            direction={{ xs: 'row', sm: 'row' }}
                            spacing={{ xs: 1, sm: 1.5 }}
                            useFlexGap
                            sx={{
                              flexWrap: 'wrap',
                            }}
                          >
                            {meds.map((medicine, medIndex) => (
                              <Chip
                                key={`${medicine.medicine_name}-${medIndex}`}
                                label={medicine.medicine_name}
                                disabled={medicine.times_daily <= medicine.doses_taken || currentDate != dayData}
                                onClick={() => handleMedClick(medicine.medicine_id, medicine.patient_id)}
                                onDelete={handleDelete}
                                deleteIcon={ medicine.times_daily <= medicine.doses_taken ? (
                                  <CheckIcon
                                    style={{
                                      width: 18,
                                      height: 18,
                                      color: 'green',
                                    }}
                                  />) : (
                                      <span style={{ fontSize: 14, fontWeight: 'bold', color: '#b15e05', marginRight: '10px' }}>
                                      {medicine.doses_taken}
                                      </span>
                                    )
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
