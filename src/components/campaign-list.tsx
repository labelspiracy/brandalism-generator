
import { Link } from 'react-router-dom';

import campaigns from '../campaigns';

export default function CampaignList(props) {
    return (
        <ul className="campaigns-list">
            {campaigns.map(campaign => (
                <li key={campaign.id}>
                    <Link to={`/${campaign.id}`}>
                        <img src={campaign.imageSource} alt={campaign.name} />
                        <h4>{campaign.name}</h4>
                    </Link>
                </li>
            ))}
            <li className="placeholder">
                <h4>More coming soon!</h4>
            </li>
        </ul>
    );
}