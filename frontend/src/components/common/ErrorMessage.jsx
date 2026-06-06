import { Alert, Box, Button } from '@mui/material';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Box py={4}>
      <Alert severity="error" action={onRetry && <Button size="small" onClick={onRetry}>Retry</Button>}>
        {message || 'Something went wrong.'}
      </Alert>
    </Box>
  );
}
