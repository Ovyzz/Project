import AppointmentList from "./components/bookings/AppointmentList";
import { BrowserRouter as Router, Redirect, Switch, Route, } from "react-router-dom";
import Booking from "./components/bookings/Booking";
import { isAuthenticated } from "./helper/user/loginChecker";
import Login from './components/user/Login';
import Main from './components/Main';
import Payment from "./components/payments/Payment";
import PaymentList from "./components/payments/PaymentList";
import PeopleList from "./components/podcasts/PeopleList";
import Podcast from "./components/podcasts/Podcast";
import PodcastList from "./components/podcasts/PodcastList";
import React, { useState, useEffect, useMemo } from 'react';
import Register from './components/user/Register';
import { UserContext } from "./components/user/UserContext";

function App() {
  const [user, setLoginUser] = useState(false);

  const providerValue = useMemo(() => ({ user, setLoginUser }), [user, setLoginUser]);

  useEffect(() => {
    if (localStorage.jwtToken) {
      (async () => {
        const validToken = await isAuthenticated();
        validToken === true ? setLoginUser(true) : setLoginUser(false);
      })();
    }
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <UserContext.Provider value={providerValue}>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/register">
              {user ? <Redirect to="/main" /> : <Register />}
            </Route>
            <Route exact path="/login">
              {user ? <Redirect to="/main" /> : <Login />}
            </Route>
            <Route exact path="/main">
              {user ? <Main /> : <Redirect to="/login" />}
            </Route>
            {user && <Route exact path="/main/bookings">
              <Booking />
            </Route >}
            {user && <Route exact path="/main/appointment-list">
              <AppointmentList />
            </Route >}
            {user && <Route exact path="/main/payment">
              <Payment />
            </Route >}
            {user && <Route exact path="/main/payment-list">
              <PaymentList />
            </Route >}
            {user && <Route exact path="/main/people-list">
              <PeopleList />
            </Route >}
            {user && <Route exact path="/main/podcast">
              <Podcast />
            </Route >}
            {user && <Route exact path="/main/podcast-list">
              <PodcastList />
            </Route >}
          </UserContext.Provider>
        </Switch>
      </Router>
    </>
  );
}

export default App;
