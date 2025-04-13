import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Add, Edit } from '@mui/icons-material';

const PackingStatus = () => {
  const { tripId } = useParams();
  const [packingStatus, setPackingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchPackingStatus();
  }, [tripId]);

  const fetchPackingStatus = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}/packing-status`);
      setPackingStatus(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch packing status');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (itemId, status) => {
    try {
      await axios.put(`/api/trips/${tripId}/packing-status/${itemId}`, status);
      fetchPackingStatus();
    } catch (err) {
      setError('Failed to update packing status');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h4" gutterBottom>
        Packing Status
      </Typography>
      
      {/* Overall Progress */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Overall Progress: {packingStatus?.progress}%
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={packingStatus?.progress} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Packing Items Grid */}
      <Grid container spacing={3}>
        {packingStatus?.items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.itemId}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Chip 
                    label={item.category} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                {editingItem === item.itemId ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateStatus(item.itemId, {
                        ...item,
                        quantity: parseInt(e.target.value)
                      })}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Notes"
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateStatus(item.itemId, {
                        ...item,
                        notes: e.target.value
                      })}
                      margin="normal"
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {item.quantity}
                    </Typography>
                    {item.notes && (
                      <Typography variant="body2" color="textSecondary">
                        Notes: {item.notes}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
                <Button
                  startIcon={item.packed ? <CheckCircle /> : <RadioButtonUnchecked />}
                  onClick={() => handleUpdateStatus(item.itemId, {
                    ...item,
                    packed: !item.packed
                  })}
                  color={item.packed ? 'success' : 'default'}
                >
                  {item.packed ? 'Packed' : 'Not Packed'}
                </Button>
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditingItem(editingItem === item.itemId ? null : item.itemId)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Item Button */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {/* Handle add new item */}}
          sx={{ borderRadius: 2 }}
        >
          Add New Item
        </Button>
      </Box>
    </Box>
  );
};

export default PackingStatus; 