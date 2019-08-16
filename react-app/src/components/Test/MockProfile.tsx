import React from 'react';
import { updateProfileAPI } from '../../util/API'; 
import { UserName, ProfileData, OrgProp, Affiliation, UserProfileService } from '../../redux/interfaces';
import nouserpic from '../../assets/nouserpic.png';

import { Row, Col, Card, Input, Icon, Button } from 'antd';
const { Meta } = Card;
const { TextArea } = Input;

/**
 *  Profile.tsx is a view component
 *  Parent componenet - pages/Home.tsx
 *  -----!important---
 *  Setup the className on the save/edit button wrapper div to match its intput field id
 */

interface Props {
    baseURL: string;
    token: string;
    userName: UserName;
    editEnable: Boolean;
    userProfile: ProfileData;
    orgs: Array<OrgProp>;
    gravatarHash: string;
    profileloaded: Boolean;
    orgsloaded: Boolean;
}
interface State {
    userName: {
        name: string;
        userID: string;
    };
    userProfile: {
        organization: string;
        department: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        affiliations: Array<Affiliation>;
        researchStatement: string;
        jobTitle: string;
        researchInterests: Array<string>;
        fundingSource: string;
        gravatarDefault: string;
        avatarOption: string;
    }
    userProfileLoading: boolean;
    organizations: Array<OrgProp>;
    organizationsLoading: boolean;
    gravatar: any;
}
/**
 * Profile class component.
 * @param props
 */
class MockProfile extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            userName: {
                name: '',
                userID: ''
            },
            userProfile: {
                organization: '',
                department: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
                affiliations: [],
                researchStatement: '',
                jobTitle: '',
                researchInterests: [],
                fundingSource: '',
                gravatarDefault: '',
                avatarOption: ''
            },
            userProfileLoading: true,
            organizations: [],
            organizationsLoading: true,
            gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />
        }
        this.inputEnableDisable =this.inputEnableDisable.bind(this);
        this.toggleSaveEdit = this.toggleSaveEdit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.userNameDisplay = this.userNameDisplay.bind(this);
        this.editSaveButtons = this.editSaveButtons.bind(this);
        this.cardTitle = this.cardTitle.bind(this);
    }
    //TODO: AKIYO  to separate this props value checking from componentDidmount
    // so that componentDidUpdate can also use it. 
    componentDidMount(){
        console.log('profile props', this.props);
        // after initial mounting, check props values
        // before setting the state and using them.
        if (this.props.userName) {
            this.setState({ userName: this.props.userName});
        }
        // setting the state values into one variable: profile
        // to avoid multiple re-rendering.
        let profile = this.state.userProfile;
        for ( let key in this.props.userProfile ) {
            switch ( key ) {
                case 'researchInterests':
                case 'affiliations':
                    if (typeof this.props.userProfile[key] !== 'undefined' && Array.isArray(this.props.userProfile[key])) {
                        profile.researchInterests = this.props.userProfile.researchInterests;
                    }
                    break;
                case 'jobTitle':
                case 'jobTitleOther':
                    if (this.props.userProfile.jobTitle === 'Other' && typeof this.props.userProfile.jobTitle !== 'undefined') {
                        profile.jobTitle = this.props.userProfile.jobTitleOther;
                    } else if (typeof profile.jobTitle !== 'undefined') {
                        profile.jobTitle = this.props.userProfile.jobTitle;
                    }
                    break;
                case 'avatarOption':
                    // Set gravatarURL
                    if (this.props.userProfile.avatarOption === 'silhoutte' || !this.props.gravatarHash) {
                        this.setState({gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={nouserpic} />});
                    } else if (this.props.gravatarHash) {
                        let gravatarURL =
                            'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=300&amp;r=pg&d=' + profile.gravatarDefault;
                    this.setState({gravatar: <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt="avatar" src={gravatarURL} />});
                    }
                    break;
                case 'organization':
                case 'department':
                case 'city':
                case 'state':
                case 'postalCode':
                case 'country':
                case 'researchStatement':
                case 'fundingSource':
                case 'gravatarDefault':
                    if (typeof this.props.userProfile[key] !== 'undefined') {
                        profile[key] = this.props.userProfile[key];
                    }
                break;
                default: 
                console.error(key, "what did you change to get here....")
            }
        }
        this.setState({ 
            userProfile: profile, 
            userProfileLoading: false
        })
        if (this.props.orgs) {
            this.setState({
                organizations: this.props.orgs,
                organizationsLoading: false
            })
        }
    }

    componentDidUpdate(){
        console.log("component did UPDATE in mock profile", this.props)
    }

    /**
     * Enable edit on text field
     * @param event
     * @param edit if the input field should be disabled or not false=disabled
     */
    inputEnableDisable(event: any, edit:boolean){
        let divID = event.target.parentNode.className;
        let selectorText = '#'+ divID;
        let el = document.querySelector(selectorText);
        if( el instanceof HTMLElement ) {
            // without this type check, dynamic styling doens't work.
            if ( edit) {
                el.removeAttribute('disabled');
                el.style.cursor = 'pointer'
            } else if ( !edit) {
                el.setAttribute("disabled", "");
                el.style.cursor = 'not-allowed'
            }
        } else {
            throw new Error("element not in document")
        }
    }

    /**
     * Taggle save/edit button
     * @param event 
     */
    toggleSaveEdit(event:any){
        event.target.style.visibility= "hidden";
        if(event.target.className.includes('save-button-on-title')) {
            // save button is clicked
            let elem = event.target.parentNode
            let el = elem.querySelector('.edit-button-on-title');
            if ( el instanceof HTMLElement ) {
                // without this type check, dynamic styling doens't work.
                el.style.visibility= "visible";
            } else {
                throw new Error("element not in document")
            }
        } else if(event.target.className.includes('edit-button-on-title')) {
            // edit button is clicked
            let elem = event.target.parentNode;
            let el = elem.querySelector('.save-button-on-title');
            if ( el instanceof HTMLElement ) {
                // without this type check, dynamic styling doens't work.
                el.style.visibility = 'visible';
            } else {
                throw new Error("element not in document")
            }
        }
    } 

    /**
     * handle edit/save button onclick
     * event can be alot of things per MDN - 
     * "Element, document, and window are the most common event targets,
     * but other objects can be event targets too,
     * for example XMLHttpRequest, AudioNode, AudioContext, and others."
     * @param event 
     */
    handleEdit(event:any) {
        let edit:boolean = false;
        if( event.target.className.includes('save-button-on-title') ) {
            edit = false;
        } else if (event.target.className.includes('edit-button-on-title')) {
            edit = true;
        }
        console.log(event.target.value)
        let value:string = event.target.value;
        this.toggleSaveEdit(event); // toggle save/edit button
        this.inputEnableDisable(event, edit); // enable and disable input/text field
        // TODO: AKIYO this is going to be action 
        let updatedProfile:UserProfileService = {
            user: {
                username: 'amarukawa',
                realname: 'Akiyo Marukawa'
            },
            profile: {
                userdata: {
                    organization: 'Lawrence Berkeley National Laboratory (LBNL)',
                    department: 'BOOO',
                    city: 'Berkeley',
                    state: 'California',
                    postalCode: '94720',
                    country: 'United States',
                    affiliations:[{title: 'foobarrrrrr', organization: 'buzz', started: '1969', ended: 'Present'}, {title: 'bazBuz barz', organization: 'Hello', started: '1969', ended: '1973'}],
                    researchStatement: value,
                    jobTitle: 'Other',
                    jobTitleOther: 'Front end dev',
                    researchInterests: ['Genome Annotation', 'Genome Assembly', 'Microbial Communities', 'Comparative Genomics', 'Expression', 'Metabolic Modeling', 'Read Processing', 'Sequence Analysis', 'Utilities', 'Other'],
                    fundingSource: 'DOE National Nuclear Security Administration (NNSA)',
                    gravatarDefault: 'mm',
                    avatarOption: ''
                }
            },
            synced:{
                gravatarHash: '4210d8e14db97e647b8cedc9fa3c4119'
            }
            
        }
        updateProfileAPI(this.props.token, this.props.baseURL, updatedProfile)
        
    }
    /**
     * make edit and save buttons
     * @param divClassName 
     */
    editSaveButtons(divClassName:string){
        return (
            <div className={divClassName}><Button className="edit-button-on-title" icon="edit" key='editing' onClick={this.handleEdit}/><Button className="save-button-on-title" icon="save" key='saving' onClick={this.handleEdit}/></div>
            )
        }
        
    /**
     * Due to Ant design dealing with React life cycle, 
     * to display name as a default value, state cannot be used 
     * props must be used instead
     */
    userNameDisplay(){
        let name = '';
        // probably I should flip this order
        if(this.state.userName.name){
            name = this.state.userName.name;
        } else if (this.props.userName.name){
            name = this.props.userName.name;
        } else {
            name = "error";
        }
        return <div><Input className='clear-disabled' id='userName-name' defaultValue={name}/>{this.editSaveButtons('userName-name')}</div>
    }
    
    cardTitle(title:string, classname:string){
        return<div>{title}{this.editSaveButtons(classname)}</div>
    }

    render(){
        console.log("rendering", this.state.userName.name)
        return (
            <Row style={{ padding: 16 }}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Card loading={this.state.userProfileLoading} style={{ margin: '8px 0px', textAlign: 'center' }}>
                            {/* <img style={{ maxWidth: '100%', margin: '8px 0px' }} alt='avatar' src={ gravatarURL } /> */}
                            {this.state.gravatar}
                        </Card>
                        <Card
                            loading={this.state.userProfileLoading}
                            style={{ margin: '8px 0px', textAlign: 'left' }}
                            title={this.userNameDisplay()}
                        >
                            {this.editSaveButtons('userProfile')}
                            {/* TODO:AKIYO this is going to be form */}
                            <Meta title="User ID" />
                            <p>{this.state.userName.userID}</p>
                            <Meta title="Position" />
                            <Input id='userProfile-jobtitle' className='clear-disabled' defaultValue={this.state.userProfile.jobTitle} disabled={true}/>
                            <Meta title="Department" />
                            <Input id='userProfile-department' className='clear-disabled' defaultValue={this.state.userProfile.department} disabled={true}/>
                            <Meta title="Organization" />
                            <Input id='userProfile-organization' className='clear-disabled' defaultValue={this.state.userProfile.organization} disabled={true}/>
                            <Meta title="Location" />
                            <p>
                                {this.state.userProfile.city}, {this.state.userProfile.state}, {this.state.userProfile.country}
                            </p>
                            <Meta title="Primary Funding Source" />
                            <p>{this.state.userProfile.fundingSource}</p>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="card-with-height" loading={this.state.userProfileLoading} style={{ margin: '8px 0px' }} title="Research Interests">
                                    <ul style={{ textAlign: 'left' }}>
                                        {this.state.userProfile.researchInterests.map((interest) => (
                                            <li key={interest}>{interest}</li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="card-with-height" loading={this.state.organizationsLoading} style={{ margin: '8px 0px' }} title="Organizations">
                                    <ul style={{ textAlign: 'left' }}>
                                        {this.state.organizations.map((org, index) => (
                                            <li key={index}>
                                                <a href={org.url} target="_blank" rel="noopener noreferrer">
                                                    {org.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            {/* TODO:AKIYO FIX - when the box is very small it doesn't break or hide word */}
                            <Card
                                loading={this.state.userProfileLoading}
                                style={{ margin: '8px 0px' }}
                                title={this.cardTitle('Research or Personal Statement','researchStatement')}
                            >
                                <TextArea className='clear-disabled' id="researchStatement" disabled={true} defaultValue={this.state.userProfile.researchStatement}/>
                            </Card>
                            <Card loading={this.state.userProfileLoading} style={{ margin: '8px 0px' }} title="Afflications">
                                <ul style={{ textAlign: 'left' }}>
                                    {this.state.userProfile.affiliations.map((position, index) => (
                                        <li key={index}>
                                            {position.title} @ {position.organization}, {position.started} -{' '}
                                            {position.ended}{' '}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default MockProfile;
