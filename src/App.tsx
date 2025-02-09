import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DeliveryManagement from './pages/POC/DeliveryManagement';
import DailyManagement from './pages/POC/DailyManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DeliveryManagement} />
        <Route path="/daily-management/:deliveryId" component={DailyManagement} />
      </Switch>
    </Router>
  );
};

export default App; 