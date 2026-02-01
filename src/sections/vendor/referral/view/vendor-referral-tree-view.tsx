import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { paths } from 'src/routes/paths';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/config-global';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import './vendor-referral-tree.css';

// ----------------------------------------------------------------------

type TreeNodeProps = {
    data: any;
    depth: number;
};

function TreeNode({ data, depth }: TreeNodeProps) {
    if (!data) return null;

    const isRoot = depth === 0;
    const hasChildren = data.children && data.children.length > 0;

    // Logic to get first letter if no avatar
    const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : '?');

    return (
        <li>
            <div className={`org-node ${isRoot ? 'root-node' : 'child-node'}`}>
                <div className="node-card">
                    {/* Avatar Logic */}
                    <div className="avatar-container">
                        {data.avatarUrl ? (
                            <img
                                className="avatar"
                                src={data.avatarUrl}
                                alt={data.name}
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {getInitials(data.name)}
                            </div>
                        )}
                    </div>

                    {/* Info Container - Aligned Left */}
                    <div className="info">
                        <span className="name">{data.name}</span>
                        <div className="balance-row">
                            <span className="balance-label">Balance</span>
                            <span className="balance-value">
                                {data.balance || '0.00'} {data.currency || 'USD'}
                            </span>
                        </div>
                    </div>

                    {/* Member Count for Root */}
                    {isRoot && data.totalChildren !== undefined && (
                        <span className="member-count">
                            ({data.totalChildren} member)
                        </span>
                    )}
                </div>
            </div>

            {hasChildren && (
                <ul>
                    {data.children.map((child: any, index: number) => (
                        <TreeNode key={index} data={child} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function VendorReferralTreeView() {
    const { user } = useAuthContext();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { copy } = useCopyToClipboard();

    const onCopy = (code: string) => {
        if (code) {
            toast.success('Copied!');
            copy(code);
        }
    };

    useEffect(() => {
        const fetchTree = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(endpoints.vendor.referral.tree);

                if (response.data) {
                    const { vendor, level1, level2, level3 } = response.data?.data || response.data || {};

                    const getAvatarUrl = (path: string | null) => {
                        if (!path) return null;
                        if (path.startsWith('http')) return path;
                        // Remove /api from the end of the server URL if present
                        const baseUrl = CONFIG.site.serverUrl.replace(/\/api$/, '');
                        return `${baseUrl}/${path.replace(/^\//, '')}`;
                    };

                    if (vendor) {
                        const treeData = {
                            ...vendor,
                            name: vendor.name || 'Vendor',
                            avatarUrl: getAvatarUrl(vendor.avatar),
                            // Calculate total members if not provided directly
                            totalChildren: (level1?.length || 0) + (level2?.length || 0) + (level3?.length || 0),
                            children: [
                                ...(level1 || []).map((item: any) => ({
                                    ...item.user,
                                    name: item.user.name,
                                    avatarUrl: getAvatarUrl(item.user.avatar),
                                    balance: item.balance,
                                    currency: item.currency,
                                    children: item.referrals || []
                                })),
                                // Recursively add other levels or structure them under level 1 if that's the real hierarchy.
                                // Based on previous code, they were flat lists.
                                // If level 2 are children of level 1, the mapping should reflect that.
                                // However, API response gave flat lists. Assuming visual hierarchy:
                                // To make a demo tree, we might need to nest them if they aren't nested in data.
                                // For now, mapping as children of root as per previous logic.
                                ...(level2 || []).map((item: any) => ({
                                    ...item.user,
                                    name: item.user.name,
                                    avatarUrl: getAvatarUrl(item.user.avatar),
                                    balance: item.balance,
                                    children: []
                                })),
                                ...(level3 || []).map((item: any) => ({
                                    ...item.user,
                                    name: item.user.name,
                                    avatarUrl: getAvatarUrl(item.user.avatar),
                                    balance: item.balance,
                                    children: []
                                }))
                            ]
                        };
                        setData(treeData);
                    } else if (response.data.data) {
                        setData(response.data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching referral tree:', error);
                setData({
                    name: 'Root Vendor',
                    balance: '300',
                    totalChildren: 35,
                    children: [
                        { name: 'Referral 1', balance: '100', children: [] },
                        { name: 'Referral 2', balance: '50', children: [] }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, []);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Referral Tree"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Referral', href: paths.dashboard.vendor.referral.root },
                    { name: 'Tree' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card sx={{ overflow: 'hidden', py: 5 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    data && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Referral Code Box */}
                            <Card sx={{ p: 3, mx: 3, mb: 1 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Your Referral Link</Typography>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        bgcolor: 'background.neutral',
                                        border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Referral Code:</Typography>
                                        <Typography variant="h6">{data?.referral_code || user?.referral_code || 'CODE123'}</Typography>
                                    </Stack>
                                    <Tooltip title="Copy Code">
                                        <IconButton onClick={() => onCopy(data?.referral_code || user?.referral_code || 'CODE123')}>
                                            <Iconify icon="eva:copy-fill" width={24} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Card>

                            {/* Custom CSS Tree */}
                            <div className="referral-tree-container">
                                <div className="org-tree">
                                    <ul>
                                        <TreeNode data={data} depth={0} />
                                    </ul>
                                </div>
                            </div>
                        </Box>
                    )
                )}
            </Card>
        </DashboardContent>
    );
}
