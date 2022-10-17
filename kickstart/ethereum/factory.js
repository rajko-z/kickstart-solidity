import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x033daBf05740c0E04961A7D54C0F1eB12e52B898'
);

export default instance;