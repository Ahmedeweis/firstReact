import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import AvatarShape from 'src/assets/illustrations/avatar-shape';

import { Iconify } from 'src/components/iconify';

export function InvestorRequestProfitsSection() {
  const { t, i18n } = useTranslate();

  const isArabic = i18n.resolvedLanguage === 'ar';
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px solid black',
        pb: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'black',
          py: 8,
          borderRadius: 2,
        }}
      >
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            bottom: -26,
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Iconify
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 40,
            right: 0,
            bottom: -32,
            position: 'absolute',
          }}
          icon="solar:chat-round-dots-bold"
        />
        <Box
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            position: 'absolute',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 4,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
          {t('investor.dashboard.dashboardOverview.requestForProfitsMessage')}
        </Typography>
      </Box>
      <Button
        sx={{ mt: 2, mx: 3 }}
        variant="contained"
        color="primary"
        href={paths.dashboard.investor.profitRequest}
      >
        {t('investor.dashboard.dashboardOverview.requestForProfits')}
        <Iconify
          icon={isArabic ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
          width={16}
          height={16}
        />
      </Button>
    </Box>
  );
}
