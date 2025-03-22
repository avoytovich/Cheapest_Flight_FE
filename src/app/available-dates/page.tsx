'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { useGeneral } from '@/context/GeneralContext';

export default function AvailableDates() {
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const router = useRouter();
  const {
    loading,
    setLoading,
    departure,
    arrival,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    availableStartDates = [] as string[],
    setAvailableStartDates,
    availableEndDates = [] as string[],
    setAvailableEndDates,
  } = useGeneral();

  const handleConfirm = () => {
    setConfirmOpen(false);
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    router.push(`/valuable-info?${queryParams.toString()}`);
  };

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        setLoading(true);
        const responseStart = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${departure}/${arrival}/availabilities`
        );
        const responseEnd = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${arrival}/${departure}/availabilities`
        );

        if (!responseStart.ok || !responseEnd.ok) {
          throw new Error('Failed to fetch available dates');
        }

        const startData = await responseStart.json();
        const endData = await responseEnd.json();

        setAvailableStartDates(startData);
        setAvailableEndDates(endData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, [
    departure,
    arrival,
    setAvailableStartDates,
    setAvailableEndDates,
    setLoading,
  ]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Error: {error}
      </Typography>
    );

  return (
    <Box
      sx={{
        margin: 4,
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h6">Select Your Travel Dates</Typography>
      <DayPicker
        mode="range"
        selected={{
          from: startDate ? new Date(startDate) : undefined,
          to: endDate ? new Date(endDate) : undefined,
        }}
        onSelect={(range) => {
          if (
            range?.from &&
            availableStartDates.includes(format(range.from, 'yyyy-MM-dd'))
          ) {
            setStartDate(format(range.from, 'yyyy-MM-dd'));
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('startDate', format(range.from, 'yyyy-MM-dd'));
            window.history.replaceState(
              null,
              '',
              `${window.location.pathname}?${queryParams.toString()}`
            );
          } else {
            setStartDate('');
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.delete('startDate');
            window.history.replaceState(
              null,
              '',
              `${window.location.pathname}?${queryParams.toString()}`
            );
          }
          if (
            range?.to &&
            availableEndDates.includes(format(range.to, 'yyyy-MM-dd')) &&
            range.to &&
            range.from &&
            format(range.to, 'yyyy-MM-dd') !== format(range.from, 'yyyy-MM-dd')
          ) {
            setEndDate(format(range.to, 'yyyy-MM-dd'));
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('endDate', format(range.to, 'yyyy-MM-dd'));
            window.history.replaceState(
              null,
              '',
              `${window.location.pathname}?${queryParams.toString()}`
            );
          } else {
            setEndDate('');
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.delete('endDate');
            window.history.replaceState(
              null,
              '',
              `${window.location.pathname}?${queryParams.toString()}`
            );
          }
        }}
        modifiers={{
          availableStart: availableStartDates.map((date) => new Date(date)),
          availableEnd: availableEndDates.map((date) => new Date(date)),
        }}
        modifiersStyles={{
          availableStart: {
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '10px',
            padding: '5px',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
          },
          availableEnd: {
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '10px',
            padding: '5px',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
          },
        }}
        disabled={(date) =>
          !availableStartDates.includes(format(date, 'yyyy-MM-dd')) &&
          !availableEndDates.includes(format(date, 'yyyy-MM-dd'))
        }
      />
      {startDate && (
        <>
          <Typography variant="body1">
            {`Selected Start Date: ${startDate}`}
            {endDate && ` to ${endDate}`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmOpen(true)}
          >
            Confirm & Continue
          </Button>
        </>
      )}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            padding: 2,
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Confirm Your Selection
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center" sx={{ mb: 2 }}>
            You have selected <strong>{startDate}</strong>
            {endDate && (
              <>
                {' to '}
                <strong>{endDate}</strong>
              </>
            )}
            . Do you want to proceed to valuable info?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 2, paddingX: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, paddingX: 3 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
