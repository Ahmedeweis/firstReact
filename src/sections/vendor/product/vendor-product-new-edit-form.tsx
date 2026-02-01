import useSWR from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
    // Names
    name_en: zod.string().min(1, { message: 'Name (English) is required!' }),
    name_ar: zod.string().min(1, { message: 'Name (Arabic) is required!' }),

    // Descriptions
    description_en: zod.string().min(1, { message: 'Description (English) is required!' }),
    description_ar: zod.string().min(1, { message: 'Description (Arabic) is required!' }),
    short_description_en: zod.string().optional(),
    short_description_ar: zod.string().optional(),
    content_en: zod.string().optional(),
    content_ar: zod.string().optional(),

    // Images
    images: schemaHelper.files({ message: { required_error: 'Images are required!' } }),

    // Identifiers
    code: zod.string().min(1, { message: 'Product code is required!' }),
    sku: zod.string().min(1, { message: 'Product SKU is required!' }),

    // Inventory
    quantity: zod.number().min(0, { message: 'Quantity is required!' }),
    stock: zod.number().min(0, { message: 'Stock is required!' }),
    stock_status: zod.string().optional(),

    // Pricing
    price: zod.number().min(0, { message: 'Price is required!' }),
    priceSale: zod.number().optional(),
    exclusive: zod.boolean().optional(),
    tax_type: zod.string().optional(), // exclusive, inclusive
    tax_percentage: zod.number().min(0).max(100).optional(),

    // Variants & Tags
    tags: zod.array(zod.string()),
    colors: zod.string().optional(), // Comma separated or hex
    sizes: zod.string().optional(), // Comma separated
    related_product_ids: zod.string().optional(), // Comma separated

    // Category & Manufacturer
    category: zod.string().min(1, { message: 'Category is required!' }),
    manufacturer: zod.string().optional(),

    // Shipping
    requires_shipping: zod.boolean().optional(),
    dimension_unit: zod.string().optional(),
    length: zod.number().optional(),
    width: zod.number().optional(),
    height: zod.number().optional(),
    weight: zod.number().optional(),

    // Publishing
    start_date: zod.any().optional(), // Date or string
    priority: zod.number().optional(),
    publish_immediately: zod.boolean().optional(),
    is_published: zod.boolean().optional(),
});

// ----------------------------------------------------------------------

type Props = {
    currentProduct?: any;
};

export function VendorProductNewEditForm({ currentProduct }: Props) {
    const router = useRouter();

    const { data: categoriesResponse } = useSWR(endpoints.category.list, fetcher);
    const categories = categoriesResponse?.data || [];

    const { data: manufacturersResponse } = useSWR(endpoints.core.manufacturers, fetcher);
    const manufacturers = manufacturersResponse?.data || [];

    const defaultValues = useMemo(
        () => ({
            name_en: currentProduct?.name_en || '',
            name_ar: currentProduct?.name_ar || '',
            description_en: currentProduct?.description_en || '',
            description_ar: currentProduct?.description_ar || '',
            short_description_en: currentProduct?.short_description_en || '',
            short_description_ar: currentProduct?.short_description_ar || '',
            content_en: currentProduct?.content_en || '',
            content_ar: currentProduct?.content_ar || '',

            images: currentProduct?.images || [],

            code: currentProduct?.code || '',
            sku: currentProduct?.sku || '',

            quantity: currentProduct?.quantity || 0,
            stock: currentProduct?.stock || 0,
            stock_status: currentProduct?.stock_status || 'in_stock',

            price: currentProduct?.price || 0,
            priceSale: currentProduct?.priceSale || 0,
            exclusive: currentProduct?.exclusive || false,
            tax_type: currentProduct?.tax_type || 'exclusive',
            tax_percentage: currentProduct?.tax_percentage || 0,

            tags: currentProduct?.tags || [],
            colors: currentProduct?.colors || '',
            sizes: currentProduct?.sizes || '',
            related_product_ids: currentProduct?.related_product_ids || '',

            category: currentProduct?.category || '',
            manufacturer: currentProduct?.manufacturer || '',

            requires_shipping: currentProduct?.requires_shipping || true,
            dimension_unit: currentProduct?.dimension_unit || 'cm',
            length: currentProduct?.length || 0,
            width: currentProduct?.width || 0,
            height: currentProduct?.height || 0,
            weight: currentProduct?.weight || 0,

            priority: currentProduct?.priority || 1,
            publish_immediately: currentProduct?.publish_immediately || true,
            is_published: currentProduct?.is_published || true,
            start_date: currentProduct?.start_date || null,
        }),
        [currentProduct]
    );

    const methods = useForm<NewProductSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(NewProductSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();

            // Multilingual Fields
            formData.append('name[en]', data.name_en);
            formData.append('name[ar]', data.name_ar);
            formData.append('description[en]', data.description_en);
            formData.append('description[ar]', data.description_ar);
            formData.append('sub_description[en]', data.short_description_en || '');
            formData.append('sub_description[ar]', data.short_description_ar || '');
            formData.append('content[en]', data.content_en || '');
            formData.append('content[ar]', data.content_ar || '');

            // Main Product Data
            formData.append('sku', data.sku);
            formData.append('code', data.code);
            formData.append('quantity', String(data.quantity));
            formData.append('stock_status', data.stock_status || 'in_stock');
            formData.append('stock', String(data.stock));
            // Backend "stock" vs "quantity"? API list shows "stock". API doc request body "stock" and "quantity". 
            // Form has quantity. Let's send quantity as quantity. Doc says "stock" string. Maybe availability?
            // "Stock Status" field exists.

            // Pricing
            formData.append('regular_price', String(data.price));
            formData.append('sale_price', String(data.priceSale || 0));
            formData.append('tax_type', data.tax_type || 'exclusive');
            formData.append('tax_percentage', String(data.tax_percentage || 0));

            // Relationships
            formData.append('category_id', data.category);
            formData.append('manufacturer_id', data.manufacturer || '');

            // Shipping
            formData.append('required_shipping', data.requires_shipping ? '1' : '0');
            formData.append('length_class', data.dimension_unit || 'cm');
            formData.append('length', String(data.length || 0));
            formData.append('width', String(data.width || 0));
            formData.append('height', String(data.height || 0));
            formData.append('weight', String(data.weight || 0));

            // Publishing
            formData.append('is_published', data.publish_immediately || data.is_published ? '1' : '0');
            formData.append('priority', String(data.priority || 1));
            if (data.start_date) {
                // Format date if needed, or send ISO string. API doc says string.
                // Assuming Date object from DatePicker
                const date = new Date(data.start_date);
                formData.append('date_start', date.toISOString().split('T')[0]);
            }

            // Arrays
            if (data.tags && Array.isArray(data.tags)) {
                data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
            }

            if (data.colors) {
                const colors = data.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
                colors.forEach((color: string, index: number) => formData.append(`colors[${index}]`, color));
            }

            if (data.sizes) {
                const sizes = data.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
                sizes.forEach((size: string, index: number) => formData.append(`sizes[${index}]`, size));
            }

            if (data.related_product_ids) {
                const related = data.related_product_ids.split(',').map((s: string) => s.trim()).filter(Boolean);
                related.forEach((id: string, index: number) => formData.append(`related_products[${index}]`, id));
            }

            // Files (Images) -> files[]
            if (data.images && Array.isArray(data.images)) {
                data.images.forEach((file: any, index: number) => {
                    if (file instanceof File) {
                        formData.append(`files[${index}]`, file);
                    }
                });
            }

            if (currentProduct) {
                // Backend calls for POST to update product/{id} without _method: PUT
                await axiosInstance.post(endpoints.vendor.product.update(currentProduct.id), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Update success!');
                // router.push(paths.dashboard.vendor.product.root); // Usually we keep staying or go back
                // User requirement implies "product appears here", so redirecting to list is good.
            } else {
                await axiosInstance.post(endpoints.vendor.product.create, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Create success!');
            }
            reset();
            router.push(paths.dashboard.vendor.product.root);
        } catch (error) {
            console.error(error);
            // Enhanced error handling to show backend validation messages
            if (typeof error === 'object' && error !== null && 'msg' in error) {
                toast.error(error.msg);
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                toast.error(error.message);
            } else {
                toast.error('Something went wrong');
            }
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {/* Left Column: Main Content */}
                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Typography variant="h6">General Info</Typography>

                            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                                <Field.Text name="name_en" label="Name (English)" />
                                <Field.Text name="name_ar" label="Name (Arabic)" />
                            </Box>

                            <Stack spacing={1.5}>
                                <Typography variant="subtitle2">Description (English)</Typography>
                                <Field.Editor name="description_en" sx={{ maxHeight: 300 }} />
                            </Stack>
                            <Stack spacing={1.5}>
                                <Typography variant="subtitle2">Description (Arabic)</Typography>
                                <Field.Editor name="description_ar" sx={{ maxHeight: 300 }} />
                            </Stack>

                            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                                <Field.Text name="short_description_en" label="Short Description (English)" multiline rows={3} />
                                <Field.Text name="short_description_ar" label="Short Description (Arabic)" multiline rows={3} />
                            </Box>

                            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                                <Field.Text name="content_en" label="Content (English)" multiline rows={3} />
                                <Field.Text name="content_ar" label="Content (Arabic)" multiline rows={3} />
                            </Box>

                            <Typography variant="h6" sx={{ mt: 2 }}>Images</Typography>
                            <Field.Upload
                                multiple
                                thumbnail
                                name="images"
                                maxSize={3145728}
                                onRemove={(inputFile) =>
                                    setValue(
                                        'images',
                                        values.images && values.images?.filter((file) => file !== inputFile),
                                        { shouldValidate: true }
                                    )
                                }
                                onRemoveAll={() => setValue('images', [], { shouldValidate: true })}
                            />
                        </Stack>
                    </Card>
                </Grid>

                {/* Right Column: Settings & Organization */}
                <Grid xs={12} md={4}>
                    <Stack spacing={3}>

                        {/* Stock & Inventory */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Stock & Inventory</Typography>
                            <Stack spacing={3}>
                                <Field.Text name="sku" label="SKU" />
                                <Field.Text name="code" label="Product Code" />
                                <Field.Text name="quantity" label="Quantity" type="number" />
                                <Field.Text name="stock" label="Stock" type="number" />
                                <Field.Select name="stock_status" label="Stock Status">
                                    <MenuItem value="in_stock">In Stock</MenuItem>
                                    <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                                    <MenuItem value="on_backorder">On Backorder</MenuItem>
                                </Field.Select>
                            </Stack>
                        </Card>

                        {/* Pricing */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Pricing</Typography>
                            <Stack spacing={3}>
                                <Field.Text
                                    name="price"
                                    label="Regular Price"
                                    type="number"
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                />
                                <Field.Text
                                    name="priceSale"
                                    label="Sale Price"
                                    type="number"
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                />

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Field.Switch name="exclusive" labelPlacement="start" label="Exclusive" />
                                </Stack>

                                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)' }}>
                                    <Field.Select name="tax_type" label="Tax Type">
                                        <MenuItem value="exclusive">Exclusive</MenuItem>
                                        <MenuItem value="inclusive">Inclusive</MenuItem>
                                    </Field.Select>
                                    <Field.Text name="tax_percentage" label="Tax %" type="number" />
                                </Box>
                            </Stack>
                        </Card>

                        {/* Organization */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Organization</Typography>
                            <Stack spacing={3}>
                                <Field.Select name="category" label="Category">
                                    <MenuItem value="">None</MenuItem>
                                    {categories.map((category: any) => (
                                        <MenuItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Field.Select>



                                <Field.Select name="manufacturer" label="Manufacturer">
                                    <MenuItem value="">None</MenuItem>
                                    {manufacturers.map((manufacturer: any) => (
                                        <MenuItem key={manufacturer.id} value={String(manufacturer.id)}>
                                            {manufacturer.name}
                                        </MenuItem>
                                    ))}
                                </Field.Select>

                                <Field.Autocomplete
                                    name="tags"
                                    label="Tags"
                                    placeholder="+ Tags"
                                    multiple
                                    freeSolo
                                    options={['Wireless', 'Gaming', 'Sport'].map((option) => option)}
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option}>
                                            {option}
                                        </li>
                                    )}
                                />
                            </Stack>
                        </Card>

                        {/* Variants */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Variants</Typography>
                            <Stack spacing={3}>
                                <Field.Text name="colors" label="Colors (comma separated or hex)" helperText="e.g. #000000, #FFFFFF" />
                                <Field.Text name="sizes" label="Sizes (comma separated)" helperText="e.g. S, M, L, XL" />
                            </Stack>
                        </Card>

                        {/* Shipping */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Shipping</Typography>
                            <Stack spacing={3}>
                                <Field.Switch name="requires_shipping" label="Requires Shipping" />

                                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)' }}>
                                    <Field.Text name="dimension_unit" label="Unit (cm/in)" />
                                    <Field.Text name="weight" label="Weight (kg)" type="number" />
                                </Box>

                                <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(3, 1fr)' }}>
                                    <Field.Text name="length" label="Length" type="number" />
                                    <Field.Text name="width" label="Width" type="number" />
                                    <Field.Text name="height" label="Height" type="number" />
                                </Box>
                            </Stack>
                        </Card>

                        {/* Publishing */}
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Publishing</Typography>
                            <Stack spacing={3}>
                                <Field.DatePicker name="start_date" label="Start Date" />
                                <Field.Text name="priority" label="Priority" type="number" />
                                <Field.Switch name="publish_immediately" label="Publish Immediately" />
                                <Field.Text
                                    name="related_product_ids"
                                    label="Related Product IDs"
                                    helperText="Comma separated IDs e.g. 2, 5, 7"
                                />
                            </Stack>
                        </Card>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                {!currentProduct ? 'Create Product' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>

                    </Stack>
                </Grid>
            </Grid >
        </Form >
    );
}
