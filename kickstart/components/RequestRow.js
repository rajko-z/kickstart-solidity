import React, { Component} from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import  { Link, Router } from '../routes';

class RequestRow extends Component {

    state = {
        loadingApprove: false,
        enabledApprove: true,
        errorMessageApprove: '',

        loadingFinalize: false,
        enabledFinalze: true,
        errorMessageFinalize: ''
    };


    onApprove = async () => {
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);
        
        this.setState({loadingApprove: true, enabledFinalze: false, errorMessageApprove: '', errorMessageFinalize: ''});
        
        try {
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({errorMessageApprove: err.message});
        }

        this.setState({loadingApprove: false, enabledFinalze: true});
    };

    onFinalize = async () => {
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);

        this.setState({loadingFinalize: true, enabledApprove: false, errorMessageFinalize: '', errorMessageApprove: ''});

        try {
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch(err) {
            this.setState({errorMessageFinalize: err.message});
        }

        this.setState({loadingFinalize: false, enabledApprove: true});
    }
    
    render() {
        const { Row, Cell} = Table;
        const { id, request, approversCount} = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount}</Cell>
                <Cell>
                    {request.complete ? <span></span> : (
                        <span>
                            {this.state.errorMessageApprove === ''? null : (<Message error header="Oops!" content={this.state.errorMessageApprove}/>)}
                            <Button loading={this.state.loadingApprove} color="white" disabled={!this.state.enabledApprove} onClick={this.onApprove}>
                                Approve
                            </Button>
                        </span>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? <span></span> : (
                    <span>
                        {this.state.errorMessageFinalize === ''? null : (<Message error header="Oops!" content={this.state.errorMessageFinalize}/>)}
                        <Button loading={this.state.loadingFinalize} disabled={!this.state.enabledFinalze} color="white" onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    </span>
                    )}
                </Cell>
            </Row>
            
        );

        
    }
}

export default RequestRow;