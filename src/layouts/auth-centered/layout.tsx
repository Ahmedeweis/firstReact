import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';
import { stylesMode } from 'src/theme/styles';

import { Main } from './main';
import {allLangs} from "../../locales";
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';
import {LanguagePopover} from "../components/language-popover";


// ----------------------------------------------------------------------

export type AuthCenteredLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function AuthCenteredLayout({ sx, children }: AuthCenteredLayoutProps) {
  const mobileNavOpen = useBoolean();

  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderBase
          logo={false}
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            centerArea:(
              <Stack direction="row" spacing={10} sx={{display: 'flex', justifyContent: 'center' , alignItems: 'center'}}>
                <LanguagePopover data-slot="localization" data={allLangs} />
              </Stack>
            )
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' } }}

        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: 1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(${CONFIG.site.basePath}/assets/background/background-3-blur.webp)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
