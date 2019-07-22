import React from 'react';
import './App.css';
import axios from "axios";
import {Button, Input, Form, Table} from "reactstrap";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import DownloadComponent from "./DownloadComponent";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state =
            {
                friendCounter: 0,
                friends: [],
                friendName: "",
                fileOwner: "",
                file: null
            };
        // this._handleOnChangeFileOwner = this._handleOnChangeFileOwner.bind(this);
        this._handleSubmitDataForm = this._handleSubmitDataForm.bind(this);
        this._handleChangeFile = this._handleChangeFile.bind(this);
        this._handleAddFriends = this._handleAddFriends.bind(this);
        // this._handleChangeFriend = this._handleChangeFriend.bind(this);
        this._handleDeleteFriend = this._handleDeleteFriend.bind(this);
    }

    _handleDeleteFriend = (friendId) => {
        const friends = this.state.friends.filter(friend => friend.id !== friendId);
        this.setState({friends});
    };


    _handleOnChangeFileOwner = (event) => {
        this.setState({fileOwner: event.target.value});
    };

    _handleChangeFile = (event) => {
        this.setState({file: event.target.files[0]});
    };

    _handleSubmitDataForm = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('file', this.state.file);
        data.append('fileOwner', this.state.fileOwner);
        data.append('friends', JSON.stringify(this.state.friends));
        axios.post("http://localhost:3000/upload/file", data)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    };

    _handleChangeFriend = (event) => {
        this.setState({friendName: event.target.value});
    };

    _handleAddFriends = () => {
        let {friends, friendName} = this.state;
        if (friendName) {
            const friend = {
                id: this.state.friendCounter,
                name: friendName
            };
            let counter = (this.state.friendCounter);
            counter++;
            friends = [...friends, friend];
            this.setState({friends});
            this.setState({friendName: "", friendCounter: counter});
        }
    };


    render() {
        const friendsRenderView = this.state.friends.map(friend =>
            <tr key={friend.id}>
                <th><p>{friend.name}</p></th>
                <th><Button color='danger' onClick={() => this._handleDeleteFriend(friend.id)}>X</Button></th>
            </tr>
        );
        return (
            <div>
                <h1>File Management App</h1>
                <Router>
                    <Route path='/download' component={DownloadComponent}/>
                    <Link to='/download'>Download File</Link>
                </Router>
                <h4>Upload File</h4>
                <Form onSubmit={this._handleSubmitDataForm}>
                    <Input type="text" placeholder="File Owner" onChange={this._handleOnChangeFileOwner}
                           value={this.state.fileOwner} name="fileOwner"/><br/>
                    <Input type="file" name="file" onChange={this._handleChangeFile}/>
                    <br/>
                    <Input value={this.state.friendName} type='text' name='friend' placeholder="friend Name"
                           onChange={this._handleChangeFriend}/>
                    <Button onClick={this._handleAddFriends}>Add Friend</Button>
                    <br/>
                    <Button color='danger'>Upload File</Button>
                </Form>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {friendsRenderView}
                    </tbody>
                </Table>
                <br/>
            </div>
        );
    }
}

export default App;
