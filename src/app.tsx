import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";

import CampaignList from './components/campaign-list';
import EditCampaign from './components/edit-campaign';

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/edit/:id" element={<EditCampaign />} />
            </Routes>
        </Router>
    );
}