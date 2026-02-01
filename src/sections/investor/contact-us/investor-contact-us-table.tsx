import type { InvestorContactUs } from 'src/types/investor/contact-us';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetInvestorContactMessages } from 'src/actions/investor/contact-us';

import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableNoData, TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

export function InvestorContactMessagesTable() {
  const { contactMessages, contactMessagesLoading } = useGetInvestorContactMessages();
  const { t } = useTranslate();

  const headLabel = [
    { id: 'id', label: t('investor.dashboard.contactUsPage.contactUsTable.contactUsId') },
    { id: 'subject', label: t('investor.dashboard.contactUsPage.contactUsTable.subject') },
    { id: 'message', label: t('investor.dashboard.contactUsPage.contactUsTable.message') },
    { id: 'created_at', label: t('investor.dashboard.contactUsPage.contactUsTable.createdAt') },
  ];

  return (
    <Card>
      <CardHeader
        title={t('investor.dashboard.contactUsPage.contactUsTable.title')}
        sx={{ mb: 3 }}
      />

      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHeadCustom headLabel={headLabel} rowCount={contactMessages.length} />

          <TableBody>
            {contactMessagesLoading ? (
              <TableRow>
                <TableCell colSpan={headLabel.length} align="center">
                  <LoadingScreen
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 5,
                      mb: 5,
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : contactMessages.length ? (
              contactMessages.map((row: InvestorContactUs) => <RowItem key={row.id} row={row} />)
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: InvestorContactUs;
};

function RowItem({ row }: RowItemProps) {
  return (
    <TableRow>
      <TableCell>{row.id}</TableCell>

      <TableCell>
        <Box component="span" sx={{ fontWeight: 600 }}>
          {row.subject}
        </Box>
      </TableCell>

      <TableCell>{row.message}</TableCell>

      <TableCell sx={{ display: 'flex', flexDirection: 'column' }}>
        {fDate(row.created_at)}
        <Box sx={{ color: 'text.secondary', fontSize: 12 }}>{fTime(row.created_at)}</Box>
      </TableCell>
    </TableRow>
  );
}
