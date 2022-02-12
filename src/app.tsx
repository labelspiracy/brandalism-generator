
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
                <Route path="/edit/:campaignId" element={<EditCampaign />} />
            </Routes>
        </Router>
    );
}