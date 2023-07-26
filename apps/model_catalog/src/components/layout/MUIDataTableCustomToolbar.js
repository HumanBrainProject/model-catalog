import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FlipIcon from "@material-ui/icons/Flip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import ContextMain from "../../ContextMain";

const defaultToolbarStyles = {
    iconButton: {},
};

class CustomToolbar extends React.Component {
    static contextType = ContextMain;

    render() {
        const [status] = this.context.status;
        const [auth] = this.context.auth;
        let addNewVersionButton = "";
        if (auth.authenticated && !status.includes("read-only")) {
            addNewVersionButton = (
                <Tooltip
                    title={
                        this.props.tableType === "models"
                            ? "Add New Model"
                            : "Add New Test"
                    }
                >
                    <IconButton onClick={this.props.addNew}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        if (this.props.display === "Models and Tests") {
            return (
                <React.Fragment>
                    <Tooltip title={"Table Width"}>
                        <IconButton onClick={this.props.changeTableWidth}>
                            <FlipIcon />
                        </IconButton>
                    </Tooltip>
                    {addNewVersionButton}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {addNewVersionButton}
                </React.Fragment>
            );
        }
    }
}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(
    CustomToolbar
);
