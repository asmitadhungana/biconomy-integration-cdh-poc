import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import KovanCDHInventory from './components/KovanCDHInventory';
import MaticCDHInventory from './components/MaticCDHInventory';
import MaticTowerChest from "./components/MaticTowerChest";

// import HelloWorld from "./components/HelloWorld";

import "./App.css";
import Button from "@material-ui/core/Button";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 700,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function App() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="MaticCDHInventory + Biconomy " {...a11yProps(0)} />
          
          {/* <Tab label="HelloWorld + Mumbai + Web3 + Custom + EIP712 Sign" {...a11yProps(0)} /> */}
          <Tab label="KovanCDHInventory + Biconomy" {...a11yProps(1)} /> 
          <Tab label="MaticTowerChest + Biconomy" {...a11yProps(2)} /> 
        </Tabs>

        {/* <TabPanel value={value} index={0}>
          <HelloWorld />
        </TabPanel> */}

        <TabPanel value={value} index={1}>
           <KovanCDHInventory />
        </TabPanel>

        <TabPanel value={value} index={0}>
          <MaticCDHInventory />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <MaticTowerChest />
        </TabPanel>
        
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;
