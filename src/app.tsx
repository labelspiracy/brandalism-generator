
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";

import CampaignList from './components/campaign-list';
import AddCampaign from './components/add-campaign';
import EditCampaign from './components/edit-campaign';

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/edit/:campaignId" element={<EditCampaign />} />
                <Route path="/add/:campaignId" element={<AddCampaign />} />
            </Routes>
        </Router>
    );
}