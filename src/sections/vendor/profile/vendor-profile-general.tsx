import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type VendorProfileSchemaType = zod.infer<typeof VendorProfileSchema>;

export const VendorProfileSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    email: zod.string().min(1, { message: 'Email is required!' }).email(),
    phone: zod.string().min(1, { message: 'Phone is required!' }),
    address: zod.string().optional(),
    city: zod.string().optional(),
    state: zod.string().optional(),
    country: zod.string().optional(),
    avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }).optional(),
});

// ----------------------------------------------------------------------

export function VendorProfileGeneral() {
    const { user } = useMockedUser();

    const defaultValues = useMemo(
        () => ({
            name: user?.displayName || '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            country: user?.country || '',
            avatarUrl: user?.photoURL || null,
        }),
        [user]
    );

    const methods = useForm<VendorProfileSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(VendorProfileSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            toast.success('Update success!');
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                        <Field.UploadAvatar
                            name="avatarUrl"
                            maxSize={3145728}
                            helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 3,
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.disabled',
                                    }}
                                >
                                    Allowed *.jpeg, *.jpg, *.png, *.gif
                                    <br /> max size of {fData(3145728)}
                                </Typography>
                            }
                        />
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                        >
                            <Field.Text name="name" label="Name" />
                            <Field.Text name="email" label="Email Address" />
                            <Field.Text name="phone" label="Phone Number" />
                            <Field.Text name="address" label="Address" />
                            <Field.Text name="city" label="City" />
                            <Field.Text name="state" label="State/Region" />
                            <Field.Text name="country" label="Country" />
                        </Box>

                        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
