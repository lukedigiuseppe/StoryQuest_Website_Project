/* Hey guys, this is a sample React component that you can have a look at which connects to the backend.
 * As with all React components we import React and our other modules first. For connecting to the backend,
 * we need axios as well. Axios is the module that allows us to send HTTP requests to the backend server. Thus allowing
 * to retrieve the data stored in MongoDB
*/
import React, {Component} from 'react';
import axios from 'axios';

// The following imports will depend on the specific component and depends on what it's purpose is

// We need connect from redux to allow us to connect to the store. A store can be thought of as just a magic blackbox that contains the
// global state of the application. That is in order to allow every single one of our components to know what the current state of the app is
// for example if a user is logged in or not etc. the component needs to request this from the store. If you don't need to know the global state, such as 
// just displaying data from the backend then this is not neccessary.
import {connect} from 'react-redux';

// We also will need PropTypes. PropTypes is just a convention when creating react components that require "props" (properties) to be passed in from another 
// component. props are basically the same as HTML attributes. For example <Login auth={user} /> Here auth would be one of those props. And user is the value passed
// in. So what PropTypes does is to tell react what props the component should expect when it is called and if those props aren't given then an error will occur.
import PropTypes from 'prop-types';

// Import reactstrap to get the access to react implementations of bootstrap CSS
import {
    Button, 
    Form, 
    Input,
} from 'reactstrap';

class Sample extends Component {


    // We always have a constructor if we need the component to maintain some sort of state information. Such as the data that is input by a user from a form.
    // Constructors always need to have props passed in and super(props) called. Don't ask why, just do it.
    constructor(props) {
        super(props);

        // We then declare our initial state for the component here. For a form it is usually just a bunch of empty strings, for each of the input fields.
        // In this example we will just be pulling the user's profile info from the backend. We will also be sending some dummy information to a sample route
        // on the backend to demonstrate how to POST requests to the backend.
        
        // When pulling data from the backend take a look at the backend route and look for the "get" route and then see what res.send() sends. Usually a JSON object. Which
        // can be accessed with the dot-notation. 
        this.state = {
            publicName: "",
            firstName: "",
            lastName: "",

            // Then we also have fields in the state for holding the form data. Which we will call field1, field2, field3 here
            field1: "",
            field2: "",
            field3: ""
        }
    }

    // For pulling data from the backend we usually call the lifecycle method componentDidMount which is called before the first render of the component
    componentDidMount() {
        // Then we use axios.get to pull the data in, .then basically serves to wait until the userinfo is pulled and then it gets executed. It requires a callback
        // function. Basically a function in it. We define this callback using the arrow notation from javascript just for simplicity. res stands for the response object which contains a lot of stuff,
        // you can print it out to console to see but it's massive. What we want is the .data part of it which contains the data sent by the backend
        axios.get('/userinfo')
            .then(res => {
                // We then call setState here to assign the information we got back into our state so that we can render it.
                this.setState({
                    publicName: res.data.publicName,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName
                })
            })
            .catch(err => {
                // This catches any errors such as 400 replies etc. or any errors from the backend. How you deal with it is up to you. But usually printing an error to the console,
                // or you can have a separate error field in the state that you can check for errors in the render method.
                console.log(err);
            });
    }

    // For posting form information, it gets a little more complicated. We will require two functions, onChange and onSubmit. 
    // onChange is the function that is run whenever there is a change in the input fields of the form. So we normally update the component state in this function.
    // onSubmit is the function that is run once the submit button has been pressed. We usually put our axios POST request in this function.

    onChange = (e) => {
        // This is basically the same function for every component. e stands for event and has the target attribute. The target then has the following attributes
        // id, name, type and value. These attributes correspond to the attributes specified in the <input> tag. We can use the shorthand below that automatically
        // matches the id of the input field to its corresponding field in the component state.
        this.setState({ [e.target.id]: e.target.value });
    }

    onSubmit = (e) => {
        // The prevent default is stop the default behaviour of HTML which is to reload the page whenever the submit button is pressed. But we don't want that
        // in most cases.
        e.preventDefault();

        // Then we construct a new object to hold all of the form data
        const formData = {
            field1: this.state.field1,
            field2: this.state.field2,
            field3: this.state.field3
        }

        console.log(formData);
        
        // Now we POST that data to the backend. It follows a similar format to the GET request. Excpet that next to the route we send data as JSON. In this case it is our formData
        axios
            .post('/sample', formData)
            .then(res => {
                // Do whatever you want with the response here, or whatever you want to happen after getting a response from the server.
                console.log(res);
            })
            .catch(err => {
                // Likewise do whatever you want here when an error happens in the backend. You can check for what the error is etc. Or log it to see the different
                // errors that are received and deal with different ones correspondingly.
                console.log(err);
            })
    }

    // Now we can finally define the render function. 

    render() {
        // We will just render a form and display the received info here. By the way make sure you log in using the login page first before trying to view this page. Otherwise
        // you wont' see any of the user info.

        return(
            <div>

                {/* Display the received user info */}

                <h1>User firstname: {' '}{this.state.firstName}</h1>
                <br />
                <h1>User lastname: {' '}{this.state.lastName}</h1>
                <br />
                <h1>User publicname: {' '}{this.state.publicName}</h1>
                <br />

                <Form noValidate onSubmit={this.onSubmit}>
                    {/* Remember id in the input field must be the same as the name for the state */}
                    <Input
                        onChange={this.onChange}
                        value={this.state.field1}
                        type="text" 
                        id="field1" 
                        name ="field1"
                        placeholder="Enter some text for field1" 
                        />
                    <Input
                        onChange={this.onChange}
                        value={this.state.field2}
                        type="text" 
                        id="field2" 
                        name ="field2"
                        placeholder="Enter some text for field2" 
                    />
                    <Input
                        onChange={this.onChange}
                        value={this.state.field3}
                        type="text" 
                        id="field3" 
                        name ="field3"
                        placeholder="Enter some text for field3" 
                    />

                    {/* Render a submit button */}
                <Button type="submit">Submit</Button>
                </Form>
            </div>
        )

    }
}

// Finally you may or may not have to define your PropTypes here. You will need to if you want the page to not be accessible to public users. i.e. They must be logged in to see this page.
// Simply call the class_name.propTypes and assign a JSON object containing the props you need and the corresponding type. Generally either func for function or object for a general Javascript
// object. Then we usually specify. isRequired to say that the component cannot be rendered without passing in these props. 
Sample.propTypes = {
    auth: PropTypes.object.isRequired
};

// MapStateToProps is a function we define and is only required when accessing the store for the global state of the application. This basically allows us to automatically assign the global state object to this component and
// then pass it in as props. Thus we are then allowed to access it from within the component by calling this.props.auth. Note we call auth here because that is the name of the authorisation state from the
// store that I have created. Just use auth and follow it, should work for all components that we will be making.
const mapStateToProps = state => ({
    auth: state.auth
});

// Now is the important part, here we have to connect the component to the store (remember global app state is stored there). To do this we have to write in the following format for the export
// export default connect("pass the mapStateToProps function here")(class_name) where class_name is the name of this react component.

export default connect(mapStateToProps)(Sample);