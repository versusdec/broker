import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import {Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, SvgIcon, Typography, useMediaQuery} from '@mui/material';
import {alpha} from '@mui/material/styles';
import {AccountButton} from '../account-button';
import {LanguageSwitch} from '../language-switch';
import {NotificationsButton} from '../notifications-button';
import {SearchButton} from '../search-button';
import {useMe} from "../../../hooks/useMe";
import {useProjects} from "../../../hooks/useProjects";
import {Input} from "../../../components/input";
import {useCallback, useEffect, useMemo, useState} from "react";
import {api} from "../../../api";

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
  const {onMobileNavOpen, ...other} = props;
  const [projects, setProjects] = useState(null);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const {data} = useMe();
  const projectParams = useMemo(() => ({limit: 100, status: 'active'}), [])
  const {id, setProjectId} = useProjects()
  
  const getProjects = useCallback(async () => {
    const {result, error} = await api.projects.list(projectParams)
    if (result && result.items.length) setProjects(result.items)
  }, [])
  
  useEffect(() => {
    getProjects()
  }, [getProjects])
  
  return (
    <Box
      component="header"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        position: 'sticky',
        boxShadow: theme => (theme.shadows[1]),
        left: {
          lg: `${SIDE_NAV_WIDTH}px`
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
        },
        zIndex: (theme) => theme.zIndex.appBar
      }}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          width={200}
        >
          {projects && projects.length && <Input
            fullWidth
            label="Project"
            onChange={(e) => {
              setProjectId(e.target.value)
            }}
            select
            size={'small'}
            value={id ?? 0}
          >
            <MenuItem key={'select'} value={0}>
              Select project
            </MenuItem>
            {projects && projects.map((item, i) => {
              
              return <MenuItem key={i} value={item.id}>
                {item.name}
              </MenuItem>
            })}
          
          </Input>}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu01Icon/>
              </SvgIcon>
            </IconButton>
          )}
          {/*<SearchButton />*/}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Typography variant={'subtitle2'}>{data && data.balance} $</Typography>
          {/*<LanguageSwitch />*/}
          <NotificationsButton/>
          <AccountButton/>
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func
};
