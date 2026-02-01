import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewSuccessorSchemaType = zod.infer<typeof NewSuccessorSchema>;

export const NewSuccessorSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    phone: zod.string().min(1, { message: 'Phone is required!' }),
    proof_type: zod.string().min(1, { message: 'Proof Type is required!' }),
    proof_id: zod.string().min(1, { message: 'Proof ID is required!' }),
    kinship: zod.string().min(1, { message: 'Kinship is required!' }),
    nationality: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
    currentSuccessor?: any;
};

export function VendorSuccessorNewEditForm({ currentSuccessor }: Props) {
    const router = useRouter();

    const defaultValues = useMemo(
        () => ({
            name: currentSuccessor?.name || '',
            phone: currentSuccessor?.phone || '',
            proof_type: currentSuccessor?.proof_type || 'passport',
            proof_id: currentSuccessor?.proof_id || '',
            kinship: currentSuccessor?.kinship || '',
            nationality: currentSuccessor?.nationality || '',
        }),
        [currentSuccessor]
    );

    const methods = useForm<NewSuccessorSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(NewSuccessorSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentSuccessor) {
                await axiosInstance.put(endpoints.vendor.successor.update(''), data);
                toast.success('Update success!');
            } else {
                await axiosInstance.post(endpoints.vendor.successor.create, data);
                toast.success('Create success!');
            }
            reset();
            router.push(paths.dashboard.vendor.successor.root);
        } catch (error) {
            console.error(error);
            toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong');
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                        >
                            <Field.Text name="name" label="Full Name" />
                            <Field.Text name="phone" label="Phone Number" />
                            <Field.CountrySelect name="nationality" label="Nationality" placeholder="Choose a country" />

                            <Field.Select name="proof_type" label="Proof Type">
                                <MenuItem value="passport">Passport</MenuItem>
                                <MenuItem value="personal_id">Personal ID</MenuItem>
                            </Field.Select>

                            <Field.Text name="proof_id" label="Proof ID Number" />

                            <Field.Select name="kinship" label="Relationship">
                                <MenuItem value="son">Son</MenuItem>
                                <MenuItem value="daughter">Daughter</MenuItem>
                                <MenuItem value="spouse">Spouse</MenuItem>
                                <MenuItem value="brother">Brother</MenuItem>
                                <MenuItem value="sister">Sister</MenuItem>
                                <MenuItem value="father">Father</MenuItem>
                                <MenuItem value="mother">Mother</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Field.Select>
                        </Box>



                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentSuccessor ? 'Add Successor' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
