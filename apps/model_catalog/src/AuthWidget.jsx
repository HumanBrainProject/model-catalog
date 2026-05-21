import React from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from "@material-ui/core/Tooltip";
import { withSnackbar } from "notistack";
import ContextMain from "./ContextMain";
import { copyToClipboard } from "./utils";


function AuthWidget(props) {

    const context = React.useContext(ContextMain);
    const [auth] = context.auth;

    const handleCopyToken = () => {
        if (auth?.token) {
            copyToClipboard(
                auth.token,
                props.enqueueSnackbar,
                props.closeSnackbar,
                "Auth token copied to clipboard",
                "success"
            );
        } else {
            copyToClipboard(
                "",
                props.enqueueSnackbar,
                props.closeSnackbar,
                "No auth token available",
                "error"
            );
        }
    };

    if (props.currentUser) {
        return (
            <Tooltip title={`${props.currentUser} — click to copy auth token`}>
                <IconButton variant="outlined" onClick={handleCopyToken}>
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

export default withSnackbar(AuthWidget);