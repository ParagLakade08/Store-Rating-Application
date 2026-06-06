import { useState } from 'react';
import { Box, Rating, Typography, CircularProgress, Tooltip } from '@mui/material';
import ratingService from '../../services/ratingService';
import { useSnackbar } from 'notistack';

export default function StoreRatingWidget({ storeId, myRating, onRated }) {
  const [hover,    setHover]    = useState(-1);
  const [loading,  setLoading]  = useState(false);
  const { enqueueSnackbar }     = useSnackbar();

  const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

  const handleChange = async (_, value) => {
    if (!value) return;
    setLoading(true);
    try {
      const res = await ratingService.submitOrUpdate({ store_id: storeId, rating: value });
      enqueueSnackbar(res.data.message, { variant: 'success' });
      onRated && onRated(value);
    } catch (e) {
      enqueueSnackbar(e.response?.data?.message || 'Failed to submit rating', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <Tooltip title={labels[hover !== -1 ? hover : (myRating || 0)] || ''}>
          <span>
            <Rating
              value={myRating || 0}
              onChange={handleChange}
              onChangeActive={(_, v) => setHover(v)}
              precision={1}
              size="small"
            />
          </span>
        </Tooltip>
      )}
      {myRating > 0 && (
        <Typography variant="caption" color="primary.main" fontWeight={600}>
          Your rating: {myRating}
        </Typography>
      )}
    </Box>
  );
}
