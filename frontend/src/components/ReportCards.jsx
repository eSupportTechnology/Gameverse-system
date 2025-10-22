import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper
} from "@mui/material";

const ReportCards = ({ metrics }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: { xs: '8px', sm: '12px', md: '16px' },
        mb: { xs: 4, md: 5 },
        '@media (max-width: 900px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (max-width: 600px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
      }}
    >
      {metrics.map(metric => (
        <Card
          key={metric.id}
          sx={{
            background: '#151b2b',
            border: '1px solid #1e293b',
            borderRadius: { xs: '8px', md: '10px' },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            height: '100%',
            minHeight: { xs: '120px', sm: '140px', md: '150px' },
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              border: '1px solid #334155'
            }
          }}
        >
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Centered Icon */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: { xs: 1.5, md: 2 }
            }}>
              <Paper
                sx={{
                  width: { xs: '50px', sm: '60px', md: '70px' },
                  height: { xs: '50px', sm: '60px', md: '70px' },
                  borderRadius: { xs: '8px', md: '10px' },
                  background: typeof metric.iconBg === 'object' ? metric.iconBg.backgroundColor : metric.iconBg,
                  backgroundImage: typeof metric.iconBg === 'object' ? metric.iconBg.backgroundImage : metric.iconBg,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: 'none',
                  '& svg': {
                    width: { xs: '24px', sm: '30px', md: '36px' },
                    height: { xs: '24px', sm: '30px', md: '36px' }
                  },
                  '& img': {
                    width: { xs: '24px', sm: '30px', md: '36px' },
                    height: { xs: '24px', sm: '30px', md: '36px' },
                    objectFit: 'contain'
                  }
                }}
              >
                {metric.icon}
              </Paper>
            </Box>

            {/* Change Percentage - Top Right */}
            <Typography
              sx={{
                position: 'absolute',
                top: { xs: '12px', sm: '16px', md: '20px' },
                right: { xs: '12px', sm: '16px', md: '20px' },
                color: '#800a70',
                fontSize: { xs: '12px', sm: '14px', md: '16px' },
                fontWeight: '600',
                lineHeight: 1
              }}
            >
              {metric.change}
            </Typography>
            {/* Value and Label - Bottom Left */}
            <Box sx={{ mt: 'auto', textAlign: 'left' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontSize: { xs: '14px', sm: '16px', md: '16px' }, 
                  fontWeight: '500', 
                  mb: { xs: 0.5, md: 0.75 }, 
                  letterSpacing: '-0.3px',
                  color: '#fff',
                  lineHeight: 1.1,
                  wordBreak: 'break-word'
                }}
              >
                {metric.value}
              </Typography>
              <Typography 
                sx={{ 
                  color: '#24c1ddff', 
                  fontSize: { xs: '12px', sm: '15px', md: '18px' }, 
                  fontWeight: '700',
                  lineHeight: 1.2
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ReportCards;