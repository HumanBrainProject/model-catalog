import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from "@material-ui/core/Tooltip";
import ContextMain from "../../ContextMain";


function AuthWidget(props) {

    const context = React.useContext(ContextMain);
    const [auth] = context.auth;

    if (auth.authenticated || props.currentUser) {

        if (!props.currentUser) {
            auth.loadUserInfo().then((userInfo) => {
                console.log(userInfo);
                props.setCurrentUser(userInfo.preferred_username);
            });
        };

        return (
            <Tooltip title={props.currentUser || "anonymous"}>
                <IconButton variant="outlined">
                    <PersonIcon />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Button
                variant="outlined"
                color="primary"
                disableElevation
                size="small"
                onClick={auth.login} // todo: login with scopes
            >
                Login
            </Button>
        );
    }
}

export default AuthWidget;